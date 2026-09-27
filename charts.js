function sizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width*dpr));
  canvas.height = Math.max(1, Math.floor(240*dpr));
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  return {ctx,w:rect.width,h:240};
}

export function lineChart(canvas, points, {label='', suffix=''}={}) {
  if (!canvas) return;
  const {ctx,w,h}=sizeCanvas(canvas);
  ctx.clearRect(0,0,w,h);
  const pad={l:42,r:14,t:28,b:32};
  ctx.font='12px system-ui';
  ctx.fillStyle='#687181';
  ctx.fillText(label, pad.l, 16);
  if (!points?.length) {
    ctx.fillText('No measurements yet', pad.l, h/2);
    return;
  }
  const vals=points.map(p=>Number(p.value)).filter(Number.isFinite);
  if (!vals.length) return;
  let min=Math.min(...vals), max=Math.max(...vals);
  if (min===max) {min-=1; max+=1;} else { const extra=(max-min)*.18; min-=extra; max+=extra; }
  const x=(i)=>pad.l+(points.length===1?(w-pad.l-pad.r)/2:i*(w-pad.l-pad.r)/(points.length-1));
  const y=(v)=>pad.t+(max-v)/(max-min)*(h-pad.t-pad.b);
  ctx.strokeStyle='#e2e6ec'; ctx.lineWidth=1;
  for(let i=0;i<4;i++){ const yy=pad.t+i*(h-pad.t-pad.b)/3; ctx.beginPath();ctx.moveTo(pad.l,yy);ctx.lineTo(w-pad.r,yy);ctx.stroke(); }
  ctx.strokeStyle='#1e6f5c'; ctx.lineWidth=2.5; ctx.beginPath();
  points.forEach((p,i)=>{const xx=x(i), yy=y(Number(p.value)); i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}); ctx.stroke();
  points.forEach((p,i)=>{ const xx=x(i),yy=y(Number(p.value)); ctx.fillStyle='#151a22';ctx.beginPath();ctx.arc(xx,yy,4,0,Math.PI*2);ctx.fill(); });
  ctx.fillStyle='#687181'; ctx.font='11px system-ui';
  const first=points[0], last=points.at(-1);
  ctx.fillText(first.date?.slice(5)||'',pad.l,h-10);
  const t=last.date?.slice(5)||''; ctx.fillText(t,w-pad.r-ctx.measureText(t).width,h-10);
  ctx.fillStyle='#151a22'; ctx.font='700 12px system-ui';
  const latest=`${last.value}${suffix}`; ctx.fillText(latest,w-pad.r-ctx.measureText(latest).width,16);
}
