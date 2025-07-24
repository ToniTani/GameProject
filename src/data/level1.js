export default { 
   nodes: [
    { id: 'A', label: 'SpaceX',             correctNeighbors: ['B','C','D'] },
    { id: 'B', label: 'Blue Origin',        correctNeighbors: ['A','C'] },
    { id: 'C', label: 'Rocket Lab',         correctNeighbors: ['A','B'] },
    { id: 'D', label: 'Virgin Galactic',    correctNeighbors: ['A','E'] },
    { id: 'E', label: 'Orbital ATK',        correctNeighbors: ['D'] },
    { id: 'F', label: 'AstroNova',          correctNeighbors: [] },
    { id: 'G', label: 'GalacticExpress',    correctNeighbors: [] },
    { id: 'H', label: 'StellarLink',        correctNeighbors: [] },
    { id: 'I', label: 'LunarLogistics',     correctNeighbors: [] },
    { id: 'J', label: 'OrionTech',          correctNeighbors: [] }
  ],
timeLimit: 50,
thresholds: [4],
layout: 'circle',
story: 'Great job! The business network has stabilized—now let’s see how stars align…'
};