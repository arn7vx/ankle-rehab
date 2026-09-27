import {pct, STAGES, estimateStage} from './rehab-plan.js';

function latestAssessment(state){ return state.assessments?.slice().sort((a,b)=>String(a.date).localeCompare(String(b.date))).at(-1) || null; }
function fmt(v, suffix=''){ return (v===undefined||v===null||v==='') ? '—' : `${v}${suffix}`; }

export function buildReport(state) {
  const a=latestAssessment(state);
  const stage=estimateStage(a);
  const stageObj=STAGES.find(s=>s.id===stage.stage);
  const sessions=(state.sessions||[]).slice().sort((x,y)=>String(x.date).localeCompare(String(y.date)));
  const last7=sessions.filter(s=>new Date(s.date) >= new Date(Date.now()-7*86400000));
  const flares=last7.filter(s=>s.nextDay==='flare').length;
  const giveways=last7.filter(s=>s.stability==='gave-way').length;
  const highestPain=last7.reduce((m,s)=>Math.max(m,Number(s.pain||0)),0);
  const lines=[];
  lines.push('ANKLE REHAB PROGRESS REPORT');
  lines.push(`Generated: ${new Date().toLocaleDateString('en-AU')}`);
  lines.push(`Injury: ${state.profile?.injurySummary || 'Ankle ligament injury'}`);
  lines.push(`Injured side: ${state.profile?.injuredSide || 'not set'}`);
  lines.push(`Sport goal: ${state.profile?.sport || 'Futsal'}`);
  lines.push(`Current suggested training stage: ${stageObj?.letter || ''} — ${stageObj?.name || stage.stage}`);
  if (stage.gameCandidate) lines.push('Return-to-game status: full-training exposure documented; review match return conservatively (not medical clearance).');
  lines.push('');
  lines.push('LATEST ASSESSMENT');
  if (!a) lines.push('No assessment recorded yet.');
  else {
    lines.push(`Date: ${a.date}`);
    lines.push(`Walking pain: ${fmt(a.walkPain,'/10')} | Stairs: ${fmt(a.stairsPain,'/10')} | Confidence: ${fmt(a.confidence,'%')}`);
    lines.push(`Swelling: ${fmt(a.swelling)} | Giving-way: ${fmt(a.givingWay)}`);
    lines.push(`Knee-to-wall: injured ${fmt(a.ktwInjured,' cm')} / healthy ${fmt(a.ktwHealthy,' cm')} (${fmt(pct(a.ktwInjured,a.ktwHealthy),'%')} symmetry)`);
    lines.push(`Single-leg calf raises: injured ${fmt(a.calfInjured)} / healthy ${fmt(a.calfHealthy)} (${fmt(pct(a.calfInjured,a.calfHealthy),'%')} symmetry)`);
    lines.push(`Bent-knee calf raises: injured ${fmt(a.soleusInjured)} / healthy ${fmt(a.soleusHealthy)} (${fmt(pct(a.soleusInjured,a.soleusHealthy),'%')} symmetry)`);
    lines.push(`Single-leg balance: injured ${fmt(a.balanceInjured,' s')} / healthy ${fmt(a.balanceHealthy,' s')} (${fmt(pct(a.balanceInjured,a.balanceHealthy),'%')} symmetry)`);
    lines.push(`Step-down: ${fmt(a.stepDown)}`);
    if (a.pogo30 || a.forwardHopSym || a.lateralHopSym) lines.push(`Impact: 30s single-leg pogo ${fmt(a.pogo30)} | forward hop symmetry ${fmt(a.forwardHopSym,'%')} | lateral hop symmetry ${fmt(a.lateralHopSym,'%')}`);
    if (a.runComfort || a.cut45 || a.cut90) lines.push(`Athletic: run ${fmt(a.runComfort)} | brake ${fmt(a.brakeComfort)} | 45° cut ${fmt(a.cut45)} | 90° cut ${fmt(a.cut90)} | reactive cut ${fmt(a.reactiveCut)}`);
    if (a.fullTraining) lines.push(`Futsal: modified training ${fmt(a.modifiedTraining)} | full training ${fmt(a.fullTraining)} × ${fmt(a.fullTrainingCount)} | next day ${fmt(a.trainingNextDay)}`);
  }
  lines.push('');
  lines.push('LAST 7 DAYS');
  lines.push(`Rehab sessions: ${last7.length}`);
  lines.push(`Highest session pain: ${highestPain}/10`);
  lines.push(`Next-day flares logged: ${flares}`);
  lines.push(`Giving-way episodes logged: ${giveways}`);
  if (last7.length) {
    const avgConf=Math.round(last7.reduce((s,x)=>s+Number(x.confidence||0),0)/last7.length*10)/10;
    lines.push(`Average session confidence: ${avgConf}/10`);
  }
  lines.push('');
  lines.push('STAGE REASONING / CURRENT LIMITERS');
  (stage.reasons||[]).forEach(r=>lines.push(`- ${r}`));
  lines.push('');
  lines.push('Please review progression, next-stage readiness, any concerning pattern, and what to change in the next week.');
  return lines.join('\n');
}
