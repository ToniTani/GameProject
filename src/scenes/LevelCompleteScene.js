import Phaser from 'phaser';

export default class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelCompleteScene' });
  }

  init(data) {
    // data.level is already the next level number (1-based)
    this.nextLevel = data.level;
    this.score     = data.score;
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

    this.add
      .text(width/2, height/2 - 80, 'Level Complete!', {
        fontSize: '48px', color: '#44ff44', fontStyle: 'bold'
      })
      .setOrigin(0.5);

    this.add
      .text(width/2, height/2 - 20, `Score: ${this.score}`, {
        fontSize: '24px', color: '#ffffff'
      })
      .setOrigin(0.5);

    // “Next Level” button:
    this.add
      .text(width/2, height/2 + 40, 'Next Level', {
        fontSize: '20px',
        color: '#00ff00',
        backgroundColor: '#222',
        padding: { x:10, y:5 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        // Pass exactly the same nextLevel into GraphPuzzleScene
        this.scene.start('GraphPuzzleScene', {
          level: this.nextLevel
        });
      });

    // Optional: “Main Menu” button
    this.add
      .text(width/2, height/2 + 90, 'Main Menu', {
        fontSize: '20px',
        color: '#00aaff',
        backgroundColor: '#222',
        padding: { x:10, y:5 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        this.scene.start('MenuScene');
      });
  }
}