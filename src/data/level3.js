export default [
  { id: 'A', label: 'CaAcme Corp', correctNeighbors: ['B', 'C'] },
  { id: 'B', label: 'Beta LLC', correctNeighbors: ['A', 'D'] },
  { id: 'C', label: 'Cyberdyne', correctNeighbors: ['A', 'E'] },
  { id: 'D', label: 'Delta Inc', correctNeighbors: ['B'] },
  { id: 'E', label: 'Echo Co', correctNeighbors: ['C'] },
  { id: 'F', label: 'Falcon Ltd', correctNeighbors: [] },
  { id: 'G', label: 'Gamma plc', correctNeighbors: ['H'] },
  { id: 'H', label: 'Helix AG', correctNeighbors: ['G'] },
  { id: 'I', label: 'Ionix', correctNeighbors: [] },
  { id: 'J', label: 'Jupiter Systems', correctNeighbors: [] }
];