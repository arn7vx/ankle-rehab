export const STAGES = [
  {
    id: 'assessment', letter: '0', name: 'Benchmark', short: 'Assessment',
    purpose: 'Measure symptoms, movement, strength and control before deciding what to load.',
    criteria: ['Baseline assessment recorded', 'Red flags reviewed'],
    exercises: []
  },
  {
    id: 'A', letter: 'A', name: 'Normal Ankle', short: 'Daily function',
    purpose: 'Restore comfortable everyday movement and usable ankle range.',
    criteria: ['Walking and stairs are comfortable (about 0–2/10)', 'No meaningful reactive swelling', 'No repeated giving-way in daily life', 'Knee-to-wall is improving toward the other side'],
    exercises: ['knee-wall', 'ankle-circles', 'double-calf', 'split-squat-supported']
  },
  {
    id: 'B', letter: 'B', name: 'Strong Ankle', short: 'Strength & control',
    purpose: 'Build calf/soleus endurance, medial-lateral ankle strength and single-leg control.',
    criteria: ['Single-leg calf endurance is approaching the other side', 'Bent-knee calf work is controlled', 'Single-leg balance is close to the other side', 'Step-down is controlled without meaningful pain/instability'],
    exercises: ['knee-wall', 'single-calf', 'soleus-calf', 'band-eversion', 'band-inversion', 'tib-raise', 'step-down', 'balance-reach']
  },
  {
    id: 'C', letter: 'C', name: 'Springy Ankle', short: 'Impact & landing',
    purpose: 'Rebuild the ability to absorb and reproduce force through hopping and landing.',
    criteria: ['Low-level single-leg pogos are comfortable', 'Forward and lateral landings are controlled', 'Hop performance is approaching the other side', 'No meaningful next-day flare after impact work'],
    exercises: ['single-calf', 'soleus-calf', 'dl-pogo', 'sl-pogo', 'hop-stick', 'lateral-hop-stick', 'line-hops']
  },
  {
    id: 'D', letter: 'D', name: 'Athletic Ankle', short: 'Run, brake & cut',
    purpose: 'Progress from straight-line running into braking, lateral movement and planned/reactive changes of direction.',
    criteria: ['Running is comfortable', 'Hard deceleration is controlled', '45° and 90° planned cuts are comfortable', 'Reactive direction changes do not cause giving-way', 'No meaningful next-day flare'],
    exercises: ['sl-pogo', 'run-walk', 'accelerate-brake', 'lateral-shuffle', 'cut-45', 'cut-90', 'reactive-cut']
  },
  {
    id: 'E', letter: 'E', name: 'Futsal Ankle', short: 'Sport exposure',
    purpose: 'Layer football-specific skills and fatigue onto the athletic movements you have rebuilt.',
    criteria: ['Ball work at speed is comfortable', 'Passing/shooting off the injured side is confident', 'Reactive cutting under fatigue is tolerated', 'Modified training completed', 'Full training completed without meaningful next-day reaction'],
    exercises: ['accelerate-brake', 'cut-90', 'reactive-cut', 'ball-slalom', 'pass-plant', 'shooting', 'futsal-intervals']
  }
];

export const EXERCISES = {
  'knee-wall': {name:'Knee-to-wall mobility', dose:'2 × 10–15', stage:'A–B', how:'Face a wall with the whole foot flat. Drive the knee forward over the toes until it touches the wall without lifting the heel. Move the foot back only as far as you can keep the heel down. Keep the movement smooth; do not force sharp medial or lateral pain.', log:'reps'},
  'ankle-circles': {name:'Gentle ankle circles / alphabet', dose:'1–2 min', stage:'A', how:'Move the ankle through comfortable plantarflexion, dorsiflexion, inversion and eversion. Use a small smooth range rather than forcing the end positions.', log:'time'},
  'double-calf': {name:'Double-leg calf raise', dose:'2–3 × 12–20', stage:'A', how:'Rise through the balls of both feet with the heels moving vertically. Pause briefly at the top and lower under control. Progress toward more load or single-leg work rather than racing the reps.', log:'reps', video:'M91D3iqdlnU'},
  'split-squat-supported': {name:'Supported split squat', dose:'2–3 × 8–12 / side', stage:'A–B', how:'Use a wall or rail for balance. Keep the front heel planted and let the knee travel comfortably forward. Use a depth that feels controlled and does not create sharp ankle pain.', log:'reps'},
  'single-calf': {name:'Single-leg calf raise', dose:'3 × 8–15', stage:'B–C', how:'Use fingertips for balance only. Rise as high as you can on the working leg, pause, then lower slowly. Stop the set when height clearly drops or you compensate. Add load once bodyweight reps are easy and symmetrical.', log:'reps', video:'M91D3iqdlnU'},
  'soleus-calf': {name:'Bent-knee calf / soleus raise', dose:'3 × 10–15', stage:'B–C', how:'Keep the knee bent while raising the heel, so the calf works without straightening the knee. This can be done standing with support or seated with load over the knee.', log:'reps'},
  'band-eversion': {name:'Banded eversion', dose:'3 × 12–20', stage:'B', how:'Anchor a resistance band to the inside. Keep the shin still and turn the forefoot outward against the band. Move slowly both ways; do not rotate the whole leg.', log:'reps', video:'M91D3iqdlnU'},
  'band-inversion': {name:'Banded inversion', dose:'3 × 12–20', stage:'B', how:'Anchor a resistance band to the outside. Keep the shin still and turn the forefoot inward against the band. Use a comfortable range; sharp medial pain is a stop signal.', log:'reps'},
  'tib-raise': {name:'Tibialis raise', dose:'2 × 15–25', stage:'B', how:'Lean against a wall with heels on the floor and lift the forefoot/toes toward the shin. Lower slowly. Step the feet farther from the wall to make it harder.', log:'reps'},
  'step-down': {name:'Controlled step-down', dose:'3 × 8–12 / side', stage:'B', how:'Stand on a low step. Slowly bend the stance knee and tap the opposite heel to the floor, then return. Keep the working foot planted and track the knee over the foot. Use a lower step if control is poor.', log:'reps'},
  'balance-reach': {name:'Single-leg balance + reach', dose:'3 × 30–45 sec', stage:'B', how:'Stand on one leg near a wall or bench for safety. Reach the free foot or hand in different directions while keeping the stance foot controlled. Progress reach distance before adding unstable surfaces.', log:'time', video:'M91D3iqdlnU'},
  'dl-pogo': {name:'Double-leg pogos', dose:'2–3 × 20 sec', stage:'C', how:'Use small quick ankle-dominant hops. Land quietly and rebound immediately. Keep amplitude small at first; the goal is elastic rhythm, not height.', log:'time'},
  'sl-pogo': {name:'Single-leg pogos', dose:'3 × 15–30 sec', stage:'C–D', how:'Small quick hops on one leg with a softly bent knee. Stay in one spot and keep contacts light. Stop if the ankle gives way, pain becomes sharp, or landing quality deteriorates.', log:'time', video:'yv0AsPOp_Hg'},
  'hop-stick': {name:'Forward hop + stick', dose:'3 × 5', stage:'C', how:'Hop forward from one foot and land on the same foot. Hold the landing for two seconds before resetting. Start short; increase distance only when the landing is quiet and controlled.', log:'reps', video:'yv0AsPOp_Hg'},
  'lateral-hop-stick': {name:'Lateral hop + stick', dose:'3 × 5 / direction', stage:'C', how:'Hop sideways and land on the same leg, then hold for two seconds. Start with a small distance and progress gradually in both directions.', log:'reps', video:'yv0AsPOp_Hg'},
  'line-hops': {name:'Forward/back + lateral line hops', dose:'3 × 20 sec', stage:'C', how:'Hop quickly across a line while keeping the contacts small and rhythmic. Build duration before speed. Start double-leg if single-leg is not yet controlled.', log:'time'},
  'run-walk': {name:'Run–walk progression', dose:'8 × (1 min jog / 1 min walk)', stage:'D', how:'Begin on a flat predictable surface. Keep the first session deliberately easy. Progress the running duration only when symptoms are settled during the session and the following morning.', log:'time'},
  'accelerate-brake': {name:'Acceleration → brake', dose:'5–8 × 10 m', stage:'D–E', how:'Accelerate over 5–10 m, then decelerate deliberately over several steps. Progress toward shorter stopping distances and greater speed rather than jumping straight to maximal sprints.', log:'reps'},
  'lateral-shuffle': {name:'Lateral shuffle', dose:'3 × 20 sec', stage:'D', how:'Stay athletic and move laterally in both directions without crossing the feet. Start at a comfortable speed and progress toward sharper pushes and stops.', log:'time'},
  'cut-45': {name:'Planned 45° cuts', dose:'4–6 / direction', stage:'D', how:'Jog or run into a marked point, plant and change direction about 45°. Start submaximal. Increase approach speed only when the plant feels stable and confident.', log:'reps'},
  'cut-90': {name:'Planned 90° cuts', dose:'4–6 / direction', stage:'D–E', how:'Approach a marker, lower your centre of mass, plant and turn about 90°. Keep early reps predictable and submaximal. Progress speed before adding reaction.', log:'reps'},
  'reactive-cut': {name:'Reactive change of direction', dose:'4 × 20–30 sec', stage:'D–E', how:'Use a partner, visual cue or random call to choose direction after movement has started. Keep the space clear and use this only after planned cuts are comfortable.', log:'time'},
  'ball-slalom': {name:'Ball slalom / dribbling', dose:'4–6 passes', stage:'E', how:'Dribble through cones with progressively tighter turns and greater speed. Build from planned lines to more reactive ball movement.', log:'reps'},
  'pass-plant': {name:'Passing while planted', dose:'3 × 10 / side', stage:'E', how:'Pass repeatedly while the injured leg alternates between support and kicking roles. Start stationary, then add movement and one-touch passing.', log:'reps'},
  'shooting': {name:'Progressive shooting', dose:'2–3 × 6–10', stage:'E', how:'Start with controlled strikes, then build approach speed and power. Include the injured leg as both plant leg and kicking leg if that matches your game demands.', log:'reps'},
  'futsal-intervals': {name:'Futsal movement intervals', dose:'4–6 × 30–60 sec', stage:'E', how:'Combine short accelerations, decelerations, lateral movements and ball touches. Keep early bouts structured; later make them reactive and closer to match intensity.', log:'time'}
};

export function pct(a,b) {
  const x = Number(a), y = Number(b);
  if (!Number.isFinite(x) || !Number.isFinite(y) || y <= 0) return null;
  return Math.round((x / y) * 100);
}

export function stageIndex(id) { return Math.max(0, STAGES.findIndex(s => s.id === id)); }

export function estimateStage(assessment) {
  if (!assessment) return {stage:'assessment', reasons:['Complete the baseline assessment first.']};
  const reasons = [];
  const asNum = (v, fallback=NaN) => (v === '' || v === null || v === undefined ? fallback : Number(v));
  const painWalk = asNum(assessment.walkPain, 10);
  const painStairs = asNum(assessment.stairsPain, 10);
  const calfSym = pct(assessment.calfInjured, assessment.calfHealthy);
  const balanceSym = pct(assessment.balanceInjured, assessment.balanceHealthy);
  const ktwSym = pct(assessment.ktwInjured, assessment.ktwHealthy);
  const basicDaily = painWalk <= 2 && painStairs <= 2 && assessment.swelling !== 'significant' && assessment.givingWay !== 'yes';
  if (!basicDaily || (ktwSym !== null && ktwSym < 70)) {
    if (painWalk > 2 || painStairs > 2) reasons.push('Everyday pain is still above the low-symptom range.');
    if (assessment.swelling === 'significant') reasons.push('Significant swelling is still present/reactive.');
    if (assessment.givingWay === 'yes') reasons.push('The ankle is still giving way.');
    if (ktwSym !== null && ktwSym < 70) reasons.push('Dorsiflexion is still substantially behind the other ankle.');
    return {stage:'A', reasons};
  }
  const strengthReady = calfSym !== null && calfSym >= 85 && balanceSym !== null && balanceSym >= 85 && ['good','minor'].includes(assessment.stepDown || '');
  if (!strengthReady) {
    if (calfSym === null) reasons.push('Calf endurance comparison has not been measured yet.');
    else if (calfSym < 85) reasons.push(`Calf endurance symmetry is ${calfSym}%.`);
    if (balanceSym === null) reasons.push('Single-leg balance comparison has not been measured yet.');
    else if (balanceSym < 85) reasons.push(`Balance symmetry is ${balanceSym}%.`);
    if (!['good','minor'].includes(assessment.stepDown || '')) reasons.push('Step-down control is not yet comfortable/controlled.');
    return {stage:'B', reasons};
  }
  const impactReady = assessment.pogo30 === 'yes' && Number(assessment.forwardHopSym || 0) >= 90 && Number(assessment.lateralHopSym || 0) >= 90 && assessment.impactNextDay !== 'flare';
  if (!impactReady) return {stage:'C', reasons:['Basic strength/control looks suitable for impact progression, but the impact benchmarks are not all met yet.']};
  const athleticReady = assessment.runComfort === 'yes' && assessment.brakeComfort === 'yes' && assessment.cut45 === 'yes' && assessment.cut90 === 'yes' && assessment.reactiveCut === 'yes';
  if (!athleticReady) return {stage:'D', reasons:['Impact benchmarks look strong; running/braking/cutting exposure still needs to be completed.']};
  const futsalReady = assessment.fullTraining === 'yes' && Number(assessment.fullTrainingCount || 0) >= 2 && assessment.trainingNextDay !== 'flare';
  if (!futsalReady) return {stage:'E', reasons:['Athletic movement benchmarks are met; build futsal-specific and full-training exposure before considering match return.']};
  return {stage:'E', reasons:['Full-training exposure is documented. Use the return-to-game checklist and conservative match minutes rather than treating this as medical clearance.'], gameCandidate:true};
}

export function stageProgress(assessment, stageId) {
  if (!assessment) return 0;
  const calfSym = pct(assessment.calfInjured, assessment.calfHealthy) ?? 0;
  const balSym = pct(assessment.balanceInjured, assessment.balanceHealthy) ?? 0;
  const ktwSym = pct(assessment.ktwInjured, assessment.ktwHealthy) ?? 0;
  if (stageId === 'A') {
    let n=0; if (Number(assessment.walkPain)<=2) n++; if (Number(assessment.stairsPain)<=2) n++; if (assessment.swelling!=='significant') n++; if (assessment.givingWay!=='yes') n++; if (ktwSym>=80) n++;
    return Math.round(n/5*100);
  }
  if (stageId === 'B') {
    let n=0; if (calfSym>=85) n++; if (balSym>=85) n++; if (['good','minor'].includes(assessment.stepDown)) n++; if (Number(assessment.walkPain)<=2) n++;
    return Math.round(n/4*100);
  }
  if (stageId === 'C') {
    let n=0; if (assessment.pogo30==='yes') n++; if (Number(assessment.forwardHopSym)>=90) n++; if (Number(assessment.lateralHopSym)>=90) n++; if (assessment.impactNextDay!=='flare') n++;
    return Math.round(n/4*100);
  }
  if (stageId === 'D') {
    const keys=['runComfort','brakeComfort','cut45','cut90','reactiveCut'];
    return Math.round(keys.filter(k=>assessment[k]==='yes').length/keys.length*100);
  }
  if (stageId === 'E') {
    let n=0; if (assessment.ballWork==='yes') n++; if (assessment.modifiedTraining==='yes') n++; if (assessment.fullTraining==='yes') n++; if (Number(assessment.fullTrainingCount)>=2) n++; if (assessment.trainingNextDay!=='flare') n++;
    return Math.round(n/5*100);
  }
  return 0;
}
