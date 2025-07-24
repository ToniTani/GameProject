import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: true });
  }

  init() {
    // nothing special here yet
  }

  create() {
    // Cache references to the DOM elements
    this.levelTitle = document.getElementById('level-title');
    this.storyText  = document.getElementById('story-text');
    this.timerEl    = document.getElementById('timer');
    this.scoreEl    = document.getElementById('score');

    // Listen for “update-timer” events from any scene
    this.game.events.on('update-timer', newTime => {
      this.timerEl.textContent = newTime;
    });

    // Listen for “update-score” events
    this.game.events.on('update-score', newScore => {
      this.scoreEl.textContent = newScore;
    });

    // Listen for “level-start” so we can change title/story per level
    this.game.events.on('level-start', levelNumber => {
      this.levelTitle.textContent = `Level ${levelNumber}`;
      this.storyText.textContent  = this.getLevelStory(levelNumber);
    });
  }

  /**
   * Return a short instruction/story snippet for a given level.
   * You can customize or load this however you like.
   */
  getLevelStory(level) {
    switch (level) {
    case 1:
      return 'Connect the five core companies before time runs out.';
    case 2:
      return 'New connections, new challenges—build the automotive network!';
    case 3:
      return 'Forge the steel empire—only true steel giants belong.';
    case 4:
      return 'Hydrogen is the future. Link the production chain to win!';
    default:
      return 'Connect all companies in the network!';
    }
  }
}