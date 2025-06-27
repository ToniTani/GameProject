import Phaser            from 'phaser';
import Graph             from '../classes/Graph.js';
import Timer             from '../classes/Timer.js';
import ScoreManager      from '../classes/ScoreManager.js';
import Player            from '../classes/Player.js';
import level1Data        from '../data/level1.js';
import level2Data        from '../data/level2.js';
// import more levels if needed…

export default class GraphPuzzleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GraphPuzzleScene' });
  }

  init(data) {
    this.level = data.level || 1;
  }

  create() {
    // 0) background color per level
    const bgColors = [0x203040, 0x002b36, 0x073642, 0x203040, 0x302010];
    this.cameras.main.setBackgroundColor(bgColors[this.level - 1] ?? 0x000000);

    // notify UI
    this.game.events.emit('level-start', this.level);

    // 1) edge graphics layer
    this.graphics = this.add.graphics();

    // 2) select dataset / timer / thresholds
    let dataset, timeLimitSeconds, scoreThresholds;
    if (this.level === 2) {
      dataset          = level2Data;
      timeLimitSeconds = 50;
      scoreThresholds  = [6];
    } else {
      dataset          = level1Data;
      timeLimitSeconds = 60;
      scoreThresholds  = [4];
      this.level = 1;
    }

    // 3) build graph
    this.graph = new Graph(this, dataset);

    // 4) timer & score
    this.timer    = new Timer(this, timeLimitSeconds);
    this.scoreMgr = new ScoreManager(this, scoreThresholds);

    // 5) create player
    const { centerX, centerY } = this.cameras.main;
    this.player = new Player(
      this,
      centerX,
      centerY + 250,
      'player',
      this.graph,
      this.scoreMgr,
      this.graphics
    );

    // 6) time-up → GameOver
    this.events.on('time-up', () => {
      this.timer.stop();
      const finalScore = this.scoreMgr.getScore();
      this.scene.start('GameOverScene', { score: finalScore });
    });

    // 7) level-complete → LevelComplete
    this.events.on('level-complete', nextLevel => {
      this.timer.stop();
      const finalScore = this.scoreMgr.getScore();
      this.scene.start('LevelCompleteScene', {
        level: nextLevel,
        score: finalScore
      });
    });

    // 8) init UI score
    this.game.events.emit('update-score', 0);
  }

  update(time, delta) {
    if (this.player) {
      this.player.update(time, delta);
    }
  }
}