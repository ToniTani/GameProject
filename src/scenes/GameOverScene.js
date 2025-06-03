import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    // Expecting { score: number } passed in from GraphPuzzleScene
    this.finalScore = data.score ?? 0;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Semi‐transparent black overlay covering the game area
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

    // “Game Over” title
    this.add
      .text(width / 2, height / 2 - 80, 'Game Over', {
        fontSize: '48px',
        color: '#ff4444',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    // Display the final score
    this.add
      .text(width / 2, height / 2 - 20, `Score: ${this.finalScore}`, {
        fontSize: '24px',
        color: '#ffffff'
      })
      .setOrigin(0.5);

    // Restart button
    this.add
      .text(width / 2, height / 2 + 40, 'Restart Level', {
        fontSize: '20px',
        color: '#00ff00',
        backgroundColor: '#222',
        padding: { x: 10, y: 5 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        // Restart the same level (passed via registry or data)
        // If you want to restart just level 1 each time, pass { level: 1 }
        const currentLevel = this.scene.settings.data.level || 1;
        this.scene.start('GraphPuzzleScene', { level: currentLevel });
      });

    // Main Menu button (if you have a MenuScene)
    this.add
      .text(width / 2, height / 2 + 90, 'Main Menu', {
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