import Phaser            from 'phaser';
import Graph             from '../classes/Graph.js';
import Timer             from '../classes/Timer.js';
import ScoreManager      from '../classes/ScoreManager.js';
import Player            from '../classes/Player.js';
import level1Config from '../data/level1.js';
import level2Config from '../data/level2.js';
import level3Config from '../data/level3.js';
import level4Config from '../data/level4.js';
import { generateSteelName, shuffleLabels, scheduleDailyHelsinki } from '../utils/nameGenerator.js';
import namingConfig from '../config/dynamicNaming.js';

const LEVELS = {
  1: level1Config,
  2: level2Config,
  3: level3Config,
  4: level4Config
};

export default class GraphPuzzleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GraphPuzzleScene' });
  }

  init(data) {
    this.level = data.level || 1;
    this.cumulativeScore = data.cumulativeScore || 0;
  }

  async create() {
    this._setupBackground();
    this._setupUI();
    await this._setupCoreGame();
    this._setupPlayer();
    this._setupEndOfLevelHandlers();
  }

  update(time, delta) {
    if (this.player) this.player.update(time, delta);
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  _setupBackground() {
    const bgColors = [0x203040, 0x002b36, 0x073642, 0x203040, 0x302010];
    this.cameras.main.setBackgroundColor(
      bgColors[this.level - 1] ?? 0x000000
    );
    this.game.events.emit('level-start', this.level);
  }

  _setupUI() {
    // Score / High score
    this.scoreText = this.add.text(16,16,'Score: 0',{ fontSize:'20px', color:'#fff' });
    const saved = localStorage.getItem('highScore');
    this.highScore = saved ? +saved : 0;
    this.highScoreText = this.add.text(16,40,`High Score: ${this.highScore}`,{
      fontSize:'20px', color:'#ff0'
    });
    this.game.events.on('update-score', s => 
      this.scoreText.setText(`Score: ${s}`)
    );
  }

  async _setupCoreGame() {
    // decide data/time/thresholds
    const cfg = LEVELS[this.level] || LEVELS[1];
    const { nodes, timeLimit, thresholds, layout } = cfg;

    if (this.level === 3) {
      const storageKey = 'level3Names';
      const today = new Date().toDateString();

      const applyLabels = (map) => {
        nodes.forEach(n => {
          if (map[n.id]) n.label = map[n.id];
        });
      };

      const regenerateAndStore = async () => {
        const indices = nodes.map((_, i) => i);
        // Shuffle indices
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        const regenCount = Math.min(namingConfig.regenerateCount, indices.length);
        const regenIndices = indices.splice(0, regenCount);
        for (const idx of regenIndices) {
          nodes[idx].label = await generateSteelName();
        }

        const shuffleCount = Math.min(namingConfig.shuffleCount, indices.length);
        if (shuffleCount > 0) {
          const shuffleNodes = indices.splice(0, shuffleCount).map(i => nodes[i]);
          shuffleLabels(shuffleNodes);
        }

        const map = nodes.reduce((acc, n) => {
          acc[n.id] = n.label;
          return acc;
        }, {});
        localStorage.setItem(
          storageKey,
          JSON.stringify({ date: new Date().toDateString(), names: map })
        );
        return map;
      };

      const stored = localStorage.getItem(storageKey);
      let labelMap = stored ? JSON.parse(stored) : null;
      if (!labelMap || labelMap.date !== today) {
        labelMap = { date: today, names: await regenerateAndStore() };
      }
      applyLabels(labelMap.names);

      scheduleDailyHelsinki(async () => {
        await regenerateAndStore();
      });
    }

    this.graphics  = this.add.graphics();
    this.graph     = new Graph(this, nodes, { layout });
    this.timer     = new Timer(this, timeLimit);
    this.scoreMgr  = new ScoreManager(this, thresholds);

    this.game.events.emit('update-score', 0);
  }

  _setupPlayer() {
    const { centerX, centerY } = this.cameras.main;
    this.player = new Player(
      this, centerX, centerY + 250,
      'player', this.graph, this.scoreMgr, this.graphics
    );
  }

  _setupEndOfLevelHandlers() {
    this.events.on('time-up',       () => this._handleGameOver());
    this.events.on('level-complete', () => this._handleLevelComplete());
  }

  _handleGameOver() {
    this.timer.stop();

    const base  = this.scoreMgr.score;
    const bonus = 0;
    this._updateHighScore(base + bonus);
    this.scene.start('GameOverScene', {
      score: base, timeLeft: bonus,
      final: base+bonus,
      highScore: this.highScore
    });
  }

  _handleLevelComplete() {
    const cfg = LEVELS[this.level] || LEVELS[1];
    this.timer.stop();
    const base  = this.scoreMgr.score;
    const bonus = this.timer.timeLeft || 0;
    this._updateHighScore(base + bonus);

    const nextLevel = this.level + 1;

    this.scene.start('LevelCompleteScene', {
      level: nextLevel,
      score: base,
      timeLeft: bonus,
      final: base+bonus,
      highScore: this.highScore,
      story: cfg.story
    });
  }

  _updateHighScore(finalScore) {
    if (finalScore > this.highScore) {
      this.highScore = finalScore;
      localStorage.setItem('highScore', finalScore);
      this.highScoreText.setText(`High Score: ${finalScore}`);
    }
  }
}
