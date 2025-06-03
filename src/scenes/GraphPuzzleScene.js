import Phaser            from 'phaser';
import Graph             from '../classes/Graph.js';
import Timer             from '../classes/Timer.js';
import ScoreManager      from '../classes/ScoreManager.js';
import level1Data        from '../data/level1.js';
import level2Data        from '../data/level2.js';
// import more levels if needed…

export default class GraphPuzzleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GraphPuzzleScene' });
  }

 init(data) {
    // Read in which level to run (default to 1 if none passed)
    this.level = data.level || 1;
  }

  create() {
  // (0) Tell UIScene what level we’re on:
  this.game.events.emit('level-start', this.level);

  // (1) Graphics layer:
  this.graphics = this.add.graphics();

  // (2) Pick data, timer, thresholds
  let dataset, timeLimitSeconds, scoreThresholds;
  switch (this.level) {
    case 1:
      dataset          = level1Data;
      timeLimitSeconds = 60;
      scoreThresholds  = [4];
      break;
    case 2:
      dataset          = level2Data;
      timeLimitSeconds = 50;
      scoreThresholds  = [6];
      break;
    // ...case 3, 4, etc...
    default:
      dataset          = level1Data;
      timeLimitSeconds = 60;
      scoreThresholds  = [4];
      this.level = 1;
      break;
  }

  // (3) Build graph with this “dataset”
  this.graph = new Graph(this, dataset);

  // (4) Start timer & score manager
  this.timer    = new Timer(this, timeLimitSeconds);
  this.scoreMgr = new ScoreManager(this, scoreThresholds);

  // (5) Hook drag + dragend
  this.input
    .on('drag',    this.onDrag,    this)
    .on('dragend', this.onDragEnd, this);

  // (6) Listen for “time-up” → GameOverScene
  this.events.on('time-up', () => {
    this.timer.stop();
    const finalScore = this.scoreMgr.getScore();
    this.scene.start('GameOverScene', { score: finalScore });
  });

  // (7) Listen for “level-complete” → LevelCompleteScene
  this.events.on('level-complete', nextLevel => {
    this.timer.stop();
    const finalScore = this.scoreMgr.getScore();
    this.scene.start('LevelCompleteScene', { level: nextLevel, score: finalScore });
  });

  // (8) Initialize UI’s score to 0
  this.game.events.emit('update-score', 0);
  
  }

  // Called every frame while dragging a node
  onDrag(pointer, circle, x, y) {
    const node = circle.getData('ref'); // a GraphNode instance
    node.setPosition(x, y);
    // Redraw all existing edges as you drag
    this.graph.renderEdges(this.graphics);
  }

  // Called when you release a node
  onDragEnd() {
    // Ask Graph to detect any brand‐new edges
    const newEdges = this.graph.detectNewEdges();
    // Redraw edges (old + newly formed)
    this.graph.renderEdges(this.graphics);

    // Compute how many of these new edges are “correct” for this level
    let delta = 0;
    newEdges.forEach(edge => {
      const fromId = edge.from.id;
      const toId   = edge.to.id;
      // Lookup the “correctNeighbors” from the dataset for this level
      const def = this.graph.data.find(n => n.id === fromId);
      if (def.correctNeighbors.includes(toId)) {
        delta += 1;
      }
    });

    // Award exactly that many points
    this.scoreMgr.add(delta);
  }
}