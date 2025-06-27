export default class GraphNode {
  /**
   * @param {string} id        Unique identifier
   * @param {string} label     Display text
   * @param {number} x         Initial x position
   * @param {number} y         Initial y position
   * @param {Phaser.Scene} scene
   */
  constructor(id, label, x, y, scene) {
    this.id    = id;
    this.label = label;
    this.scene = scene;

    // 1) draw the circle, enable drag, and store its id
    this.circle = scene.add.circle(x, y, 20, 0x888888)
      .setStrokeStyle(2, 0xffffff)
      .setInteractive({ useHandCursor: true })
      .setData('id', id);            // ← critical: so getData('id') works

    // 2) draw the label underneath
    this.text = scene.add.text(x, y + 30, label, {
      fontSize: '12px',
      color:   '#fff'
    }).setOrigin(0.5);
  }

  // helper to move both parts together
  setPosition(x, y) {
    this.circle.setPosition(x, y);
    this.text.setPosition(x, y + 30);
  }

  get x() { return this.circle.x; }
  get y() { return this.circle.y; }

  destroy() {
    this.circle.destroy();
    this.text.destroy();
  }
}