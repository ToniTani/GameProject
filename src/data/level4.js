export default { 
   nodes: [
    { id: 'A', label: 'Nel ASA',             correctNeighbors: ['B','E'] },
    { id: 'B', label: 'Plug Power',          correctNeighbors: ['A','E'] },
    { id: 'C', label: 'Air Liquide',         correctNeighbors: ['D', 'J'] },
    { id: 'D', label: 'Linde',               correctNeighbors: ['C'] },
    { id: 'E', label: 'ITM Power',           correctNeighbors: ['A','B'] },
    { id: 'F', label: 'HydroFlow',           correctNeighbors: [] },
    { id: 'G', label: 'GreenWave Energy',    correctNeighbors: [] },
    { id: 'H', label: 'HydroSynth',          correctNeighbors: [] },
    { id: 'I', label: 'FuelCell Dynamics',   correctNeighbors: [] },
    { id: 'J', label: 'H2Connect',           correctNeighbors: ['B', 'C', 'D'] }
  ],
  timeLimit: 40,
thresholds: [4],
layout: 'diamond',
story: 'Then came Diamonds—angled, gleaming, wild. They scattered light, bent rules, made business beautiful.'
};