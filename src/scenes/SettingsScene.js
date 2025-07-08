import Phaser from 'phaser';

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SettingsScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Title
    this.add.text(width/2, 80, 'Controls & Tutorial', {
      fontSize: '32px', color: '#ffffff'
    }).setOrigin(0.5);

    // Quick tutorial
    const lines = [
      '→ Use ARROW KEYS to move your avatar.',
      '→ Press your PICK-UP/DROP key to grab & place nodes.',
      '→ Connect each node to its nearest neighbor to score!'
    ];
    lines.forEach((txt, i) => {
      this.add.text(width/2, 140 + i*30, txt, {
        fontSize: '18px', color: '#cccccc'
      }).setOrigin(0.5);
    });

    // Current pick-up key
    const currentKey = this.registry.get('pickupKey') || 'E';
    this.pickupText = this.add.text(width/2, 260,
      `Pick-up/Drop Key: [ ${currentKey} ]`, {
      fontSize: '24px', color: '#00ff00'
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerup', () => this.rebindKey());

    // Back button
    this.add.text(width/2, height - 80, '← Back', {
      fontSize: '20px', color: '#00ff00', backgroundColor: '#222',
      padding: { x: 10, y: 5 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerup', () => this.scene.start('MenuScene'));
  }

  rebindKey() {
    // Prompt user to press any key
    this.pickupText.setText('Press any key…').setColor('#ffaa00');

    // Once only, grab the next keydown
    this.input.keyboard.once('keydown', e => {
      const newKey = e.key.toUpperCase();
      // Store it in the registry so Player can read it
      this.registry.set('pickupKey', newKey);
      // Update the display
      this.pickupText
        .setText(`Pick-up/Drop Key: [ ${newKey} ]`)
        .setColor('#00ff00');
    });
  }
}