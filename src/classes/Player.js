import Phaser from 'phaser';

export default class Player {
  /**
   * @param {Phaser.Scene} scene
   * @param {number}       x          – initial X
   * @param {number}       y          – initial Y
   * @param {string}       spriteKey  – key for the loaded 96×32 spritesheet (3 frames)
   * @param {Graph}        graph
   * @param {ScoreManager} scoreMgr
   * @param {Phaser.GameObjects.Graphics} graphics
   */
  constructor(scene, x, y, spriteKey, graph, scoreMgr, graphics) {
    this.scene    = scene;
    this.graph    = graph;
    this.scoreMgr = scoreMgr;
    this.graphics = graphics;
    this.heldNode = null;
    this.holdOffset = { x: 0, y: -10 };   // 10px above the player’s center
    this.dropOffset = { x: 0, y: -10 };   // same small offset when you release

    // 1) Create two animations: "idle" = frame 0, "walk" = frames 0→1→2→1
    this._createAnimations(spriteKey);

    // 2) Sprite uses that spritesheet, starts on frame 0, scaled ×2
    this.sprite = scene.physics.add
      .sprite(x, y, spriteKey, 0)   // frame 0 for idle
      .setCollideWorldBounds(true)
      .setDepth(100)
      .setScale(2)
      .play('idle');

    // 3) Input: arrow keys + "E" for pick/drop
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.pickKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // 5) Overlap: if "E" pressed while overlapping a node, pick it u

    // 6) Press "E" again to drop
    this.pickKey.off('down');  // remove any old listener
    this.pickKey.on('down', () => {
    if (this.heldNode) {
    this._tryDrop();
     } else {
    this._tryPickUp();
  }
});
  }

  _createAnimations(key) {
    // Idle → just frame 0
    this.scene.anims.create({
      key: 'idle',
      frames: [{ key, frame: 0 }],
      frameRate: 1,
      repeat: -1
    });

    // Walk → cycle frames 0→1→2→1
    this.scene.anims.create({
      key: 'walk',
      frames: this.scene.anims.generateFrameNumbers(key, { frames: [0, 1, 2, 1] }),
      frameRate: 8,
      repeat: -1
    });
  }

_tryPickUp() {
  const PICK_RADIUS = 50;
  let best     = null;
  let bestDist = PICK_RADIUS;

  this.graph.nodes.forEach(node => {
    const d = Phaser.Math.Distance.Between(
      this.sprite.x, this.sprite.y,
      node.circle.x, node.circle.y
    );
    if (d < bestDist) {
      bestDist = d;
      best     = node.circle;
    }
  });

  if (best) {
    // STOP the floating tween so it won’t snap back later
    this.scene.tweens.killTweensOf(best);

    this.heldNode = best;
    best.setDepth(200);
    best.setPosition(
      this.sprite.x + this.holdOffset.x,
      this.sprite.y + this.holdOffset.y
    );
  }
}

_tryDrop() {
  if (!this.heldNode) return;

  // 2) Grab the ID you set earlier in GraphNode
  const sourceId = this.heldNode.getData('id');
  if (!sourceId) {
    console.warn('Player._tryDrop: heldNode has no "id" data!', this.heldNode);
    this.heldNode = null;
    return;
  }

  // connect & redraw
  const edge = this.graph.connectNode(sourceId, 30, 80);
  this.graph.renderEdges();
  if (edge) {
    this.scoreMgr.add(this.graph.scoreEdge(edge));
  }

  // clear the held node
  this.heldNode = null;
}

  update() {
    const speed = 150;
    const body  = this.sprite.body;

    // 1) Stop any existing movement
    body.setVelocity(0, 0);

    // 2) Left/Right use the same "walk" animation, flipped for left
    if (this.cursors.left.isDown) {
      body.setVelocityX(-speed);
      this.sprite
        .setFlipX(true)
        .play('walk', true);
    }
    else if (this.cursors.right.isDown) {
      body.setVelocityX(speed);
      this.sprite
        .setFlipX(false)
        .play('walk', true);
    }

    // 3) Up/Down also use "walk" (no flip needed)
    else if (this.cursors.up.isDown) {
      body.setVelocityY(-speed);
      this.sprite
        .setFlipX(false)
        .play('walk', true);
    }
    else if (this.cursors.down.isDown) {
      body.setVelocityY(speed);
      this.sprite
        .setFlipX(false)
        .play('walk', true);
    }

    // 4) No arrow pressed → idle
    else {
      this.sprite.play('idle', true);
    }

    // 5) If holding a node, keep it above the player
if (this.heldNode) {
  this.heldNode.setPosition(
    this.sprite.x + this.holdOffset.x,
    this.sprite.y + this.holdOffset.y
  );
    }
  }
}