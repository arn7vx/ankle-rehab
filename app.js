import {STAGES, EXERCISES, pct, estimateStage, stageIndex, stageProgress} from './rehab-plan.js';
import {getRepoConfig, setRepoConfig, getToken, setToken, clearToken, getLocalState, setLocalState, pullLatest, pushState, exportBackup} from './database.js';
import {lineChart} from './charts.js';
import {buildReport} from './reports.js';

const $ = (id)=>document.getElementById(id);
const todayLocal = ()=> new Date().toLocaleDateString('en-CA');
const defaultState = {
  schemaVersion:1,
  profile:{injuryDate:'2026-06-18',sport:'Futsal',injuredSide:'',injurySummary:'Partial tears reported on lateral and medial ankle ligaments',currentStage:'assessment'},
  assessments:[], sessions:[], checkins:[], updatedAt:null
};
let state = getLocalState() || structuredClone(defaultState);
let syncState = 'local';
let syncMessage = 'Using local cache.';

function latestAssessment(){ return (state.assessments||[]).slice().sort((a,b)=>String(a.date).localeCompare(String(b.date))).at(-1) || null; }
function latestSession(){ return (state.sessions||[]).slice().sort((a,b)=>String(a.date).localeCompare(String(b.date))).at(-1) || null; }
function currentEstimate(){ return estimateStage(latestAssessment()); }
function stageObj(id){ return STAGES.find(s=>s.id===id) || STAGES[0]; }

function elapsedInjury() {
  const d=state.profile?.injuryDate ? new Date(`${state.profile.injuryDate}T12:00:00`) : null;
  if (!d || Number.isNaN(d.getTime())) return 'Injury date not set';
  const days=Math.max(0, Math.floor((Date.now()-d.getTime())/86400000));
  if (days < 14) return `${days} days since injury`;
  return `${Math.floor(days/7)} weeks since injury`;
}
function esc(s='') { return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function fmtDate(v){ try{return new Date(v).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'});}catch{return v;} }

function setSync(status, detail) {
  syncState=status; syncMessage=detail;
  const dot=$('syncDot'); dot.className=`dot ${status==='synced'?'synced':status==='pending'?'pending':status==='error'?'error':''}`;
  $('syncStatus').textContent = status==='synced'?'Synced':status==='pending'?'Saving…':status==='error'?'Sync problem':'Local copy';
  $('syncDetail').textContent=detail;
}

async function persist(message) {
  state.updatedAt = new Date().toISOString();
  setLocalState(state);
  render();
  if (!getToken()) {
    setSync('local','Saved on this device only — add the GitHub write token on this device to sync.');
    return {synced:false};
  }
  setSync('pending','Committing data/rehab.json to GitHub…');
  try {
    await pushState(state,message);
    setSync('synced',`Saved to GitHub · ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`);
    return {synced:true};
  } catch (e) {
    setSync('error',e.message);
    throw e;
  }
}

function renderHero() {
  const a=latestAssessment();
  $('injuryAgeChip').textContent=elapsedInjury();
  $('sideChip').textContent=state.profile?.injuredSide ? `${state.profile.injuredSide} ankle` : 'Side not set';
  $('confidenceChip').textContent=`Confidence ${a?.confidence ?? '—'}${a?.confidence!==undefined?'%':''}`;
}

function criteriaDoneFor(stage, a) {
  if (!a) return 0;
  return Math.round(stageProgress(a,stage.id)/100*stage.criteria.length);
}

function renderToday() {
  const a=latestAssessment();
  const est=currentEstimate();
  state.profile.currentStage=est.stage;
  const st=stageObj(est.stage);
  $('todayStageTitle').textContent=`${st.letter} — ${st.name}`;
  $('todayStageDesc').textContent=st.purpose;
  const progress=stageProgress(a,st.id);
  $('stagePctChip').textContent=`${progress}% of working targets`;
  $('stageProgress').style.width=`${progress}%`;
  const doneCount=criteriaDoneFor(st,a);
  $('todayCriteria').innerHTML=st.criteria.map((c,i)=>`<div class="criterion"><span class="tick ${i<doneCount?'done':''}">${i<doneCount?'✓':'·'}</span><span>${esc(c)}</span></div>`).join('');
  $('todayExercises').innerHTML = st.exercises.length ? st.exercises.map(id=>{
    const ex=EXERCISES[id]; return `<div class="exercise-row"><div><strong>${esc(ex.name)}</strong><small>${esc(ex.dose)}</small></div><span class="chip">${esc(ex.stage)}</span></div>`;
  }).join('') : `<div class="alert alert-good">Complete the baseline assessment below; the site will then suggest the most conservative appropriate training stage.</div>`;
  $('startSessionBtn').disabled=!st.exercises.length;
  $('startSessionBtn').style.opacity=st.exercises.length?'1':'.45';
}

function renderRedFlags() {
  const a=latestAssessment(); const issues=[];
  if (!a) { $('redFlags').classList.add('hidden'); return; }
  if (a.locking==='yes') issues.push('locking/catching or deep joint symptoms');
  if (a.highPain==='yes') issues.push('pain above the ankle with twisting');
  if (a.givingWay==='yes') issues.push('repeated giving-way');
  if (a.swelling==='significant') issues.push('significant swelling');
  if (Number(a.walkPain)>=5) issues.push('high pain with ordinary walking');
  if (issues.length) {
    $('redFlagText').textContent=`You logged: ${issues.join(', ')}. The tracker will stay conservative; these are reasons not to progress impact/cutting blindly.`;
    $('redFlags').classList.remove('hidden');
  } else $('redFlags').classList.add('hidden');
}

function renderStages() {
  const a=latestAssessment(); const est=currentEstimate(); const cur=stageIndex(est.stage);
  $('stageStrip').innerHTML=STAGES.map((s,i)=>`<div class="stage-step ${i<cur?'complete':''} ${i===cur?'current':''}"><div class="letter">${s.letter}</div><div class="name">${esc(s.name)}</div></div>`).join('');
  $('stageCards').innerHTML=STAGES.filter(s=>s.id!=='assessment').map(s=>{
    const idx=stageIndex(s.id); const locked=idx>cur+1;
    return `<article class="panel stage-card ${locked?'locked':''}">
      <div><div class="eyebrow">Stage ${s.letter}</div><h3>${esc(s.name)}</h3><p class="sub">${esc(s.purpose)}</p></div>
      <div><strong>Progression markers</strong><ul>${s.criteria.map(c=>`<li>${esc(c)}</li>`).join('')}</ul></div>
      <div><strong>Core work</strong><div class="exercise-list">${s.exercises.map(id=>`<div class="exercise-row"><div><strong>${esc(EXERCISES[id].name)}</strong><small>${esc(EXERCISES[id].dose)}</small></div></div>`).join('')}</div></div>
      ${locked?'<div class="lock-note">Later-stage preview only. Build the earlier capability first.</div>':''}
    </article>`;
  }).join('');
}

function renderProgress() {
  const a=latestAssessment();
  const cutoff=Date.now()-7*86400000;
  const last7=(state.sessions||[]).filter(s=>new Date(s.date).getTime()>=cutoff);
  $('metricSessions').textContent=last7.length;
  $('metricCalf').textContent=a ? `${pct(a.calfInjured,a.calfHealthy) ?? '—'}${pct(a.calfInjured,a.calfHealthy)!=null?'%':''}`:'—';
  $('metricKtw').textContent=a ? `${pct(a.ktwInjured,a.ktwHealthy) ?? '—'}${pct(a.ktwInjured,a.ktwHealthy)!=null?'%':''}`:'—';
  $('metricConfidence').textContent=a?.confidence!==undefined?`${a.confidence}%`:'—';
  const asses=(state.assessments||[]).slice().sort((x,y)=>String(x.date).localeCompare(String(y.date)));
  lineChart($('calfChart'), asses.map(x=>({date:x.date,value:pct(x.calfInjured,x.calfHealthy)})).filter(x=>x.value!=null), {label:'Calf endurance symmetry',suffix:'%'});
  lineChart($('confidenceChart'), asses.map(x=>({date:x.date,value:Number(x.confidence)})).filter(x=>Number.isFinite(x.value)), {label:'Perceived ankle recovery',suffix:'%'});
  renderHistory();
}

function renderHistory() {
  const items=[];
  (state.assessments||[]).forEach((a,i)=>items.push({kind:'assessment',i,date:`${a.date}T12:00:00`,title:'Assessment',sub:`Walk ${a.walkPain??'—'}/10 · confidence ${a.confidence??'—'}%`,right:`Calf ${pct(a.calfInjured,a.calfHealthy)??'—'}%`}));
  (state.sessions||[]).forEach((s,i)=>items.push({kind:'session',i,date:s.date,title:`Stage ${s.stage} session`,sub:`Pain ${s.pain??'—'}/10 · ${s.stability||'—'} · confidence ${s.confidence??'—'}/10`,right:s.nextDay==='unknown'?'Next day: pending':`Next day: ${s.nextDay}`}));
  items.sort((a,b)=>new Date(b.date)-new Date(a.date));
  $('history').innerHTML=items.slice(0,10).map(it=>`<div class="history-item"><div class="history-main"><strong>${esc(it.title)}</strong><small>${fmtDate(it.date)} · ${esc(it.sub)}</small></div><div class="history-right">${esc(it.right)}${it.kind==='session' && state.sessions[it.i]?.nextDay==='unknown'?`<br/><button class="btn" style="padding:5px 8px;margin-top:5px;font-size:11px" data-reaction-index="${it.i}">Set reaction</button>`:''}</div></div>`).join('') || '<div class="sub">No history yet.</div>';
  document.querySelectorAll('[data-reaction-index]').forEach(btn=>btn.addEventListener('click',()=>updateNextDay(Number(btn.dataset.reactionIndex))));
}

async function updateNextDay(index) {
  const value=prompt('Next-day reaction: type normal, mild, or flare');
  if (!['normal','mild','flare'].includes((value||'').toLowerCase())) return;
  state.sessions[index].nextDay=value.toLowerCase();
  try { await persist(`Update next-day ankle response — ${todayLocal()}`); }
  catch(e){ alert(`Saved locally, but GitHub sync failed: ${e.message}`); }
}

function renderLibrary() {
  $('exerciseLibrary').innerHTML=Object.entries(EXERCISES).map(([id,ex])=>`<article class="panel library-card"><div style="display:flex;justify-content:space-between;gap:10px"><div><div class="eyebrow">${esc(ex.stage)}</div><h3>${esc(ex.name)}</h3></div><span class="chip">${esc(ex.dose)}</span></div><details><summary>How to do it</summary><p class="sub">${esc(ex.how)}</p>${ex.video?`<a href="https://www.youtube.com/watch?v=${encodeURIComponent(ex.video)}" target="_blank" rel="noopener" class="btn" style="display:inline-block;text-decoration:none">Watch supporting demo ↗</a>`:''}</details></article>`).join('');
}

function renderReport() { $('reportBox').textContent=buildReport(state); }

function render() {
  renderHero(); renderToday(); renderRedFlags(); renderStages(); renderProgress(); renderLibrary(); renderReport();
}

function value(id){ return $(id)?.value ?? ''; }
function numOrBlank(id){ const v=value(id); return v===''?'':Number(v); }
function setVal(id,v){ if ($(id) && v!==undefined && v!==null) $(id).value=v; }

function populateAssessmentForm() {
  const a=latestAssessment();
  setVal('assessDate',todayLocal());
  setVal('injuryDate',state.profile?.injuryDate||'');
  setVal('injuredSide',state.profile?.injuredSide||a?.injuredSide||'');
  if (!a) return;
  ['walkPain','stairsPain','swelling','givingWay','locking','highPain','confidence','ktwInjured','ktwHealthy','calfInjured','calfHealthy','soleusInjured','soleusHealthy','balanceInjured','balanceHealthy','stepDown','pogo30','impactNextDay','forwardHopSym','lateralHopSym','runComfort','brakeComfort','cut45','cut90','reactiveCut','ballWork','modifiedTraining','fullTraining','fullTrainingCount','trainingNextDay'].forEach(id=>setVal(id,a[id]));
  $('confidenceOut').textContent=`${value('confidence')}%`;
}

async function saveAssessment(ev) {
  ev.preventDefault();
  const a={
    date:value('assessDate')||todayLocal(), injuredSide:value('injuredSide'), walkPain:numOrBlank('walkPain'), stairsPain:numOrBlank('stairsPain'), swelling:value('swelling'), givingWay:value('givingWay'), locking:value('locking'), highPain:value('highPain'), confidence:Number(value('confidence')),
    ktwInjured:numOrBlank('ktwInjured'), ktwHealthy:numOrBlank('ktwHealthy'), calfInjured:numOrBlank('calfInjured'), calfHealthy:numOrBlank('calfHealthy'), soleusInjured:numOrBlank('soleusInjured'), soleusHealthy:numOrBlank('soleusHealthy'), balanceInjured:numOrBlank('balanceInjured'), balanceHealthy:numOrBlank('balanceHealthy'), stepDown:value('stepDown'),
    pogo30:value('pogo30'), impactNextDay:value('impactNextDay'), forwardHopSym:numOrBlank('forwardHopSym'), lateralHopSym:numOrBlank('lateralHopSym'), runComfort:value('runComfort'), brakeComfort:value('brakeComfort'), cut45:value('cut45'), cut90:value('cut90'), reactiveCut:value('reactiveCut'), ballWork:value('ballWork'), modifiedTraining:value('modifiedTraining'), fullTraining:value('fullTraining'), fullTrainingCount:numOrBlank('fullTrainingCount'), trainingNextDay:value('trainingNextDay'), notes:value('assessmentNotes')
  };
  state.profile.injuredSide=a.injuredSide||state.profile.injuredSide;
  state.profile.injuryDate=value('injuryDate')||state.profile.injuryDate;
  const existing=(state.assessments||[]).findIndex(x=>x.date===a.date);
  if (existing>=0) state.assessments[existing]=a; else state.assessments.push(a);
  $('assessmentSaveNote').textContent='Saving…';
  try { const res=await persist(`Log ankle assessment — ${a.date}`); $('assessmentSaveNote').textContent=res.synced?'Saved + synced to GitHub.':'Saved locally; add a phone write token to sync.'; }
  catch(e){ $('assessmentSaveNote').textContent=`Local copy saved; GitHub failed: ${e.message}`; }
}

function lastExerciseLog(id) {
  const sessions=(state.sessions||[]).slice().sort((a,b)=>new Date(b.date)-new Date(a.date));
  for (const s of sessions) if (s.exercises?.[id]) return s.exercises[id];
  return null;
}

function startSession() {
  const est=currentEstimate(); const st=stageObj(est.stage); if (!st.exercises.length) return;
  $('sessionTitle').textContent=`Stage ${st.letter} · ${st.name}`;
  $('sessionExercises').innerHTML=st.exercises.map((id,idx)=>{
    const ex=EXERCISES[id], last=lastExerciseLog(id); const lastTxt=last?.sets?.filter(Boolean).join(' / ') || '—';
    return `<div class="session-exercise"><div style="display:flex;justify-content:space-between;gap:10px"><div><div class="eyebrow">${idx+1} / ${st.exercises.length}</div><h3>${esc(ex.name)}</h3><div class="sub">Target ${esc(ex.dose)} · last ${esc(lastTxt)}</div></div><span class="chip">${esc(ex.log)}</span></div><div class="set-grid"><input inputmode="decimal" data-ex="${id}" data-set="0" placeholder="Set 1"/><input inputmode="decimal" data-ex="${id}" data-set="1" placeholder="Set 2"/><input inputmode="decimal" data-ex="${id}" data-set="2" placeholder="Set 3"/></div><details style="margin-top:10px"><summary style="cursor:pointer;font-weight:800">Technique</summary><p class="sub">${esc(ex.how)}</p></details></div>`;
  }).join('');
  $('sessionOverlay').classList.remove('hidden'); document.body.style.overflow='hidden';
}
function closeSession(){ $('sessionOverlay').classList.add('hidden'); document.body.style.overflow=''; }

async function saveSession(ev) {
  ev.preventDefault();
  const est=currentEstimate(); const st=stageObj(est.stage); const exercises={};
  st.exercises.forEach(id=>{
    const sets=[0,1,2].map(i=>document.querySelector(`[data-ex="${id}"][data-set="${i}"]`)?.value||'').filter((v,i,arr)=>v!=='' || arr.some(Boolean));
    exercises[id]={sets, unit:EXERCISES[id].log};
  });
  const s={id:crypto.randomUUID?.()||String(Date.now()),date:new Date().toISOString(),stage:st.id,exercises,pain:Number(value('sessionPain')||0),stability:value('sessionStability'),difficulty:value('sessionDifficulty'),confidence:Number(value('sessionConfidence')||0),nextDay:value('sessionNextDay'),notes:value('sessionNotes')};
  state.sessions.push(s);
  $('sessionSaveNote').textContent='Saving…';
  try { const res=await persist(`Log ankle rehab session — ${todayLocal()}`); $('sessionSaveNote').textContent=res.synced?'Saved + synced to GitHub.':'Saved locally; add a write token to sync.'; if(res.synced) setTimeout(closeSession,450); }
  catch(e){ $('sessionSaveNote').textContent=`Local copy saved; GitHub failed: ${e.message}`; }
}

function openSettings() {
  const c=getRepoConfig(); setVal('repoOwner',c.owner); setVal('repoName',c.repo); setVal('repoBranch',c.branch||'main'); setVal('repoPath',c.path||'data/rehab.json'); setVal('repoToken',getToken()); $('settingsModal').classList.remove('hidden');
}
function closeSettings(){ $('settingsModal').classList.add('hidden'); }
function saveSettings(ev){
  ev.preventDefault();
  setRepoConfig({owner:value('repoOwner').trim(),repo:value('repoName').trim(),branch:value('repoBranch').trim()||'main',path:value('repoPath').trim()||'data/rehab.json'});
  setToken(value('repoToken'));
  closeSettings(); setSync('local',getToken()?'Write token configured on this device. Pull latest or save a log to test it.':'Read-only device. Public GitHub data can still be pulled.');
}

async function doPull() {
  setSync('pending','Pulling latest committed rehab data…');
  try { state=await pullLatest(); setSync('synced',`Pulled latest · ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`); populateAssessmentForm(); render(); }
  catch(e){ setSync('error',e.message); }
}

function wire() {
  $('pullBtn').addEventListener('click',doPull);
  $('settingsBtn').addEventListener('click',openSettings); $('phoneSetupBtn').addEventListener('click',openSettings);
  document.querySelectorAll('[data-close-settings]').forEach(x=>x.addEventListener('click',closeSettings));
  $('settingsModal').addEventListener('click',e=>{if(e.target===$('settingsModal')) closeSettings();});
  $('settingsForm').addEventListener('submit',saveSettings);
  $('clearTokenBtn').addEventListener('click',()=>{clearToken();setVal('repoToken','');setSync('local','Write token removed from this device.');});
  $('confidence').addEventListener('input',()=> $('confidenceOut').textContent=`${value('confidence')}%`);
  $('assessmentForm').addEventListener('submit',saveAssessment);
  $('startSessionBtn').addEventListener('click',startSession); $('closeSessionBtn').addEventListener('click',closeSession); $('sessionForm').addEventListener('submit',saveSession);
  $('copyReportBtn').addEventListener('click',async()=>{ const text=buildReport(state); try { if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text); else throw new Error('clipboard unavailable'); } catch { const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); } const old=$('copyReportBtn').textContent; $('copyReportBtn').textContent='Copied ✓'; setTimeout(()=>$('copyReportBtn').textContent=old,1200); });
  $('downloadBackupBtn').addEventListener('click',()=>exportBackup(state));
  window.addEventListener('resize',()=>renderProgress());
}

async function init() {
  wire(); populateAssessmentForm(); render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  await doPull();
}
init();
