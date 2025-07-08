export default class GraphEdge {
  /**
   * @param {GraphNode} fromNode
   * @param {GraphNode} toNode
   * @param {Phaser.Scene} scene
   */
  constructor(fromNode, toNode, scene) {
    this.from = fromNode;
    this.to   = toNode;
    this.scene = scene;
    this.key   = `${fromNode.id}-${toNode.id}`;

    // Use a single Graphics object externally to draw, so this could be metadata only
  }

  // Compute endpoints on demand:
  get points() {
    return [
      { x: this.from.x, y: this.from.y },
      { x: this.to.x,   y: this.to.y }
    ];
  }
}