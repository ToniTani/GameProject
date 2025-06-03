import Phaser    from 'phaser';
import GraphNode from './GraphNode.js';
import GraphEdge from './GraphEdge.js';


export default class Graph {
  /**
   * @param {Phaser.Scene} scene
   * @param {Array<Object>} data
   *   An array of node definitions, e.g.
   *   [
   *     { id: 'A', label: 'Acme Corp', correctNeighbors: ['B','C'] },
   *     …
   *   ]
   */
  constructor(scene, data) {
    this.scene = scene;
    this.data  = data;         // <-- store the data array here
    this.nodes = new Map();    // will map id → GraphNode instance
    this.edges = [];           // will store GraphEdge instances
    this._createNodes();       // now uses this.data instead of mockData
  }

  _createNodes() {
    const radius = 200;
    const { centerX, centerY } = this.scene.cameras.main;
    const step = (2 * Math.PI) / this.data.length;

    this.data.forEach((nodeDef, idx) => {
      const angle = idx * step;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Create a GraphNode for each entry in the passed-in data
      const node = new GraphNode(nodeDef.id, nodeDef.label, x, y, this.scene);
      this.nodes.set(nodeDef.id, node);
    });
  }

  /**
   * Find and return any brand-new edges based on proximity.
   * Only uses this.nodes map and this.data (for correctNeighbors logic later).
   * @param {number} threshold  How close two nodes must be to consider them “connected.”
   * @returns {GraphEdge[]}   An array of the newly created GraphEdge instances.
   */
  detectNewEdges(threshold = 50) {
    const newEdges = [];

    // Only check each unordered pair once:
    const keys = Array.from(this.nodes.keys()); // e.g. ['A','B','C', …]
    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        const aId = keys[i];
        const bId = keys[j];
        const aNode = this.nodes.get(aId);
        const bNode = this.nodes.get(bId);

        const dist = Phaser.Math.Distance.Between(aNode.x, aNode.y, bNode.x, bNode.y);
        const edgeKey = `${aId}-${bId}`;

        const alreadyExists = this.edges.some(e => e.key === edgeKey);
        if (dist < threshold && !alreadyExists) {
          const edge = new GraphEdge(aNode, bNode, this.scene);
          this.edges.push(edge);
          newEdges.push(edge);
        }
      }
    }

    return newEdges;
  }

  /**
   * Draw all edges (old + new) onto a Graphics object.
   * @param {Phaser.GameObjects.Graphics} graphics
   */
  renderEdges(graphics) {
    graphics.clear().lineStyle(2, 0x00ff00);
    this.edges.forEach(e => {
      const [p1, p2] = e.points;
      graphics.moveTo(p1.x, p1.y).lineTo(p2.x, p2.y);
    });
    graphics.strokePath();
  }

  /**
   * Utility to fetch the definition (from this.data) for a given node ID.
   * Useful when you want to check correctNeighbors later.
   */
  getDefinitionById(id) {
    return this.data.find(d => d.id === id);
  }

  /**
   * Clean up any created nodes (if needed).
   */
  destroy() {
    this.nodes.forEach(n => n.destroy());
    this.edges.length = 0;
  }
}