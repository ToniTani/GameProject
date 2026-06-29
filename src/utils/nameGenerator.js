const prefixes = [
  'Iron', 'Alloy', 'Steel', 'Chrome', 'Metal', 'Forge', 'Titan', 'Carbon', 'Ferrum', 'Mangan'
];
const suffixes = [
  'Works', 'Forge', 'Dynamics', 'Industries', 'Foundry', 'Systems', 'Labs', 'Corp', 'International', 'Enterprises'
];

export async function generateSteelName() {
  if (typeof fetch !== 'undefined' && import.meta.env.VITE_AI_NAME_API) {
    try {
      const res = await fetch(import.meta.env.VITE_AI_NAME_API);
      const data = await res.json();
      if (data && data.name) return data.name;
    } catch (err) {
      console.warn('AI name fetch failed', err);
    }
  }
  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const s = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${p} ${s}`;
}

export function shuffleLabels(nodes) {
  const labels = nodes.map(n => n.label);
  for (let i = labels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [labels[i], labels[j]] = [labels[j], labels[i]];
  }
  nodes.forEach((n, i) => {
    n.label = labels[i];
  });
}

export function scheduleDailyHelsinki(cb) {
  const schedule = () => {
    const now = new Date();
    const helsinki = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Helsinki' }));
    const next = new Date(helsinki);
    next.setHours(12, 0, 0, 0);
    if (helsinki >= next) next.setDate(next.getDate() + 1);
    const delay = next.getTime() - helsinki.getTime();
    setTimeout(() => {
      cb();
      schedule();
    }, delay);
  };
  schedule();
}

