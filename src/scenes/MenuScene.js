import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    this.sound.stopAll();
    this.sound.play('menu', { loop: false, volume: 0.4 });

    // full-screen quad using the Lightning pipeline
    this.add
      .rectangle(0, 0, width, height, 0xffffff)
      .setOrigin(0)
      .setPipeline('Lightning');

    // menu title
    this.add.text(width / 2, height / 2 - 40, 'Knowledge Graph Puzzle', {
      fontSize: '32px', color: '#ffffff'
    }).setOrigin(0.5);

    // start button
    this.add.text(width / 2, height / 2 + 20, '▶ Press to Start', {
      fontSize: '20px',
      color: '#00ff00',
      backgroundColor: '#222',
      padding: { x: 10, y: 5 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        
        this.sound.stopByKey('menu');
         // start the stage music once, looped
        this.sound.play('song', { loop: true, volume: 0.4 });

        this.scene.start('GraphPuzzleScene', { level: 1 });
      });
    this.add.text(width/2, height/2 + 80, '⚙ Settings', {
      fontSize: '20px', color: '#00ff00', backgroundColor: '#222', padding:{x:10,y:5}
    })
  .setOrigin(0.5)
  .setInteractive({ useHandCursor: true })
  .on('pointerup', () => this.scene.start('SettingsScene'));
  }
}