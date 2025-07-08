import Phaser from 'phaser';

export default class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelCompleteScene' });
  }

  init(data) {
    // data.level is already the next level number (1-based)
    this.nextLevel = data.level;
    this.score     = data.score;
    this.timeLeft   = data.timeLeft   || 0;
    this.finalScore = data.final      || this.baseScore;
    this.highScore  = data.highScore  || 0;
  }

  create() {
    const { width, height } = this.cameras.main;

    // semi‐transparent dark backdrop
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

    // Title
    this.add.text(width/2, height/2 - 120, 'Level Complete!', {
      fontSize: '48px',
      color:   '#44ff44',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Scores
    const infoY = height/2 - 40;
    const lineHeight = 36;
    this.add.text(width/2, infoY + lineHeight * 0, `Score: ${this.baseScore}`, {
      fontSize: '28px', color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(width/2, infoY + lineHeight * 1, `Time Bonus: ${this.timeLeft}`, {
      fontSize: '28px', color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(width/2, infoY + lineHeight * 2, `Final Score: ${this.finalScore}`, {
      fontSize: '32px', color: '#ffff00', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width/2, infoY + lineHeight * 3, `High Score: ${this.highScore}`, {
      fontSize: '28px', color: '#ffaa00'
    }).setOrigin(0.5);

    // Next Level button
    this.add.text(width/2, height/2 + 120, '▶ Next Level', {
      fontSize: '22px',
      color: '#00ff00',
      backgroundColor: '#222',
      padding: { x: 12, y: 6 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        this.scene.start('GraphPuzzleScene', { level: this.nextLevel });
      });

    // Back to Menu
    this.add.text(width/2, height/2 + 180, '← Main Menu', {
      fontSize: '20px',
      color: '#00aaff',
      backgroundColor: '#222',
      padding: { x: 10, y: 5 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        this.scene.start('MenuScene');
      });
  }
}