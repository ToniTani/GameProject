import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Show a simple loading message (optional)
    const { width, height } = this.cameras.main;
    this.add.text(width/2, height/2, 'Loading…', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 1) Load the player spritesheet under the key 'player'
    this.load.spritesheet('player','Frame47.svg', {
      frameWidth: 32,
      frameHeight: 32
    });

  // ─── audio assets ─────────────────────

    this.load.audio('menu','menu.mp3');
    this.load.audio('song','song.mp3');
    this.load.audio('pickup','pickup.mp3');
  }

  create() {
    // Once loading is done, start GraphPuzzleScene at level 1
    this.scene.start('MenuScene');
  }
}