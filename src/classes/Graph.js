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
    this.scene         = scene;
    this.data          = data;            
    this.nodes         = new Map();       
    this.currentEdges  = [];              // ← initialize here
    this.graphics      = scene.add
                            .graphics()
                            .lineStyle(2, 0x00ff00);

    this._createNodes();
  }

  _createNodes() {
    const radius     = 200;
    const { centerX, centerY } = this.scene.cameras.main;
    const step       = (2 * Math.PI) / this.data.length;

    this.data.forEach((nodeDef, idx) => {
      const angle = idx * step;
      const x     = centerX + radius * Math.cos(angle);
      const y     = centerY + radius * Math.sin(angle);

      // Create a GraphNode (it now stores its id on the circle)
      const node = new GraphNode(nodeDef.id, nodeDef.label, x, y, this.scene);
      this.nodes.set(nodeDef.id, node);

      // floating tween
      this.scene.tweens.add({
        targets: node.circle,
        props: {
          y: {
            value: y - 8,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
          }
        },
        delay: idx * 100
      });
    });
  }

  /**
   * Connect a single dropped node to its nearest neighbor
   * within [minDist..maxDist]. Returns the new edge or null.
   */
  connectNode(sourceId, minDist = 20, maxDist = 100) {
    // Guard against bad ID
    const graphNode = this.nodes.get(sourceId);
    if (!graphNode) {
      console.warn(
        `Graph.connectNode: unknown sourceId “${sourceId}”`,
        Array.from(this.nodes.keys())
      );
      return null;
    }

    const sourceCircle = graphNode.circle;
    let bestDist = Infinity, bestId = null;

    // find nearest neighbor in range
    this.nodes.forEach((node, id) => {
      if (id === sourceId) return;
      const d = Phaser.Math.Distance.Between(
        sourceCircle.x, sourceCircle.y,
        node.circle.x,  node.circle.y
      );
      if (d >= minDist && d <= maxDist && d < bestDist) {
        bestDist = d;
        bestId   = id;
      }
    });

    // create the edge if valid & not duplicate
    if (bestId) {
      const key = `${sourceId}-${bestId}`;
      if (!this.currentEdges.some(e => e.key === key)) {
        const edge = { from: sourceId, to: bestId, key };
        this.currentEdges.push(edge);
        return edge;
      }
    }

    return null;
  }

  /** Draw all stored edges. */
  renderEdges() {
    this.graphics.clear().lineStyle(2, 0x00ff00);
    this.currentEdges.forEach(e => {
      const a = this.nodes.get(e.from).circle;
      const b = this.nodes.get(e.to).circle;
      this.graphics.moveTo(a.x, a.y).lineTo(b.x, b.y);
    });
    this.graphics.strokePath();
  }

  /** Returns 1 if the dropped edge was correct, else 0. */
  scoreEdge(edge) {
    const def = this.data.find(n => n.id === edge.from);
    return def.correctNeighbors.includes(edge.to) ? 1 : 0;
  }
}