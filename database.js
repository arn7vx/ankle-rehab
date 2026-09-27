const LOCAL_STATE = 'ankleRehabStateV1';
const TOKEN_KEY = 'ankleRehabGithubToken';
const CONFIG_KEY = 'ankleRehabRepoConfig';

export function inferRepoConfig() {
  const host = location.hostname;
  if (!host.endsWith('.github.io')) return { owner:'', repo:'', branch:'main', path:'rehab.json' };
  const owner = host.split('.')[0];
  const first = location.pathname.split('/').filter(Boolean)[0];
  const repo = first || `${owner}.github.io`;
  return { owner, repo, branch:'main', path:'rehab.json' };
}

export function getRepoConfig() {
  const inferred = inferRepoConfig();
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');
    return {...inferred, ...saved, path: saved.path || inferred.path};
  } catch { return inferred; }
}

export function setRepoConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}
export function getToken() { return localStorage.getItem(TOKEN_KEY) || ''; }
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token.trim());
  else localStorage.removeItem(TOKEN_KEY);
}
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }

export function getLocalState() {
  try { return JSON.parse(localStorage.getItem(LOCAL_STATE) || 'null'); }
  catch { return null; }
}
export function setLocalState(state) {
  localStorage.setItem(LOCAL_STATE, JSON.stringify(state));
}

function rawUrl({owner, repo, branch, path}) {
  return `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${path.split('/').map(encodeURIComponent).join('/')}`;
}
function apiUrl({owner, repo, path}) {
  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
}

export async function pullLatest() {
  const config = getRepoConfig();
  if (!config.owner || !config.repo) {
    const resp = await fetch(`./rehab.json?t=${Date.now()}`, {cache:'no-store'});
    if (!resp.ok) throw new Error('Repository is not configured yet.');
    const state = await resp.json();
    setLocalState(state);
    return state;
  }
  const resp = await fetch(`${rawUrl(config)}?t=${Date.now()}`, {cache:'no-store'});
  if (!resp.ok) throw new Error(`Could not pull latest data (${resp.status}). Check repository settings.`);
  const state = await resp.json();
  setLocalState(state);
  return state;
}

function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  const chunk = 0x8000;
  for (let i=0; i<bytes.length; i+=chunk) binary += String.fromCharCode(...bytes.subarray(i, i+chunk));
  return btoa(binary);
}

async function getCurrentFile(config, token) {
  const resp = await fetch(`${apiUrl(config)}?ref=${encodeURIComponent(config.branch)}`, {
    headers: {
      'Accept':'application/vnd.github+json',
      'Authorization':`Bearer ${token}`,
      'X-GitHub-Api-Version':'2022-11-28'
    },
    cache:'no-store'
  });
  if (resp.status === 404) return null;
  if (!resp.ok) {
    const detail = await resp.json().catch(()=>({}));
    throw new Error(detail.message || `GitHub read failed (${resp.status}).`);
  }
  return resp.json();
}

export async function pushState(state, message='Update ankle rehab data') {
  const config = getRepoConfig();
  const token = getToken();
  if (!config.owner || !config.repo) throw new Error('Repository owner/name are not configured.');
  if (!token) throw new Error('No GitHub write token is saved on this device.');
  const current = await getCurrentFile(config, token);
  const payload = {
    message,
    content:utf8ToBase64(JSON.stringify(state, null, 2) + '\n'),
    branch:config.branch
  };
  if (current?.sha) payload.sha = current.sha;
  const resp = await fetch(apiUrl(config), {
    method:'PUT',
    headers:{
      'Accept':'application/vnd.github+json',
      'Authorization':`Bearer ${token}`,
      'X-GitHub-Api-Version':'2022-11-28',
      'Content-Type':'application/json'
    },
    body:JSON.stringify(payload)
  });
  if (!resp.ok) {
    const detail = await resp.json().catch(()=>({}));
    throw new Error(detail.message || `GitHub write failed (${resp.status}).`);
  }
  setLocalState(state);
  return resp.json();
}

export function exportBackup(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ankle-rehab-backup-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 500);
}
