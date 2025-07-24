export default { 
  nodes: [
    { id: 'A', label: 'Toyota',             correctNeighbors: ['B','C'] },
    { id: 'B', label: 'Volkswagen',         correctNeighbors: ['A','D'] },
    { id: 'C', label: 'Ford',               correctNeighbors: ['A','D','E'] },
    { id: 'D', label: 'BMW',                correctNeighbors: ['B','C'] },
    { id: 'E', label: 'Tesla',              correctNeighbors: ['C'] },
    { id: 'F', label: 'CyberAuto',          correctNeighbors: [] },
    { id: 'G', label: 'MotorDynamics',      correctNeighbors: [] },
    { id: 'H', label: 'AutoSphere',         correctNeighbors: [] },
    { id: 'I', label: 'DriveTech',          correctNeighbors: [] },
    { id: 'J', label: 'ElectroMobile',      correctNeighbors: [] }
  ],
timeLimit: 60,
thresholds: [4],
layout: 'star',
story: 'The network steadied—Square had arrived. Edges sharp, logic firm, Square brought order.'
};