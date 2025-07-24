export default { 
  nodes: [
    { id: 'A', label: 'ArcelorMittal',      correctNeighbors: ['B','D'] },
    { id: 'B', label: 'Nucor',              correctNeighbors: ['A','E'] },
    { id: 'C', label: 'POSCO',              correctNeighbors: ['D','E'] },
    { id: 'D', label: 'Tata Steel',         correctNeighbors: ['A','C'] },
    { id: 'E', label: 'U​nited States Steel',correctNeighbors: ['B','C'] },
    { id: 'F', label: 'IronForge',          correctNeighbors: [] },
    { id: 'G', label: 'SteelNova',          correctNeighbors: [] },
    { id: 'H', label: 'AlloyWorks',         correctNeighbors: [] },
    { id: 'I', label: 'MetalliCorp',        correctNeighbors: [] },
    { id: 'J', label: 'ChromeX',            correctNeighbors: [] }
  ],
timeLimit: 45,
thresholds: [4],
layout: 'square',
story: 'Then came Diamonds—angled, gleaming, wild. They scattered light, bent rules, made business beautiful.'
};