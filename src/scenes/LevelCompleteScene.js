import Phaser from 'phaser';

export default class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelCompleteScene' });
  }

  init(data) {
    this.timeBonus  = data.timeLeft   || 0;
    this.finalScore = data.final      || 0;
    this.highScore  = data.highScore  || 0;
    this.nextLevel  = data.level      || 1;
    this.story      = data.story      || '';
  }

create() {
  const { width, height } = this.cameras.main;
  const cx = width / 2;

  // dark overlay
  this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

  // layout constants
  const TITLE_SIZE   = 40;
  const TEXT_SIZE    = 18;
  const PAD          = 16;
  const LINE_HEIGHT  = 32;

  // extra padding after story and between buttons
  const STORY_PAD    = 32;
  const BTN_PAD      = 24;

  // 1) Title at 20% down
  let y = height * 0.2;
  this.add.text(cx, y, 'Level Complete!', {
    fontSize: `${TITLE_SIZE}px`,
    color:   '#44ff44',
    fontStyle:'bold'
  }).setOrigin(0.5);
  y += TITLE_SIZE + PAD;

  // 2) Time Bonus
  this.add.text(cx, y, `Time Bonus: ${this.timeBonus}`, {
    fontSize: `${TEXT_SIZE}px`,
    color:    '#ffffff'
  }).setOrigin(0.5);
  y += LINE_HEIGHT;

  // 3) Final Score
  this.add.text(cx, y, `Final Score: ${this.finalScore}`, {
    fontSize: `${TEXT_SIZE}px`,
    color:    '#ffff00'
  }).setOrigin(0.5);
  y += LINE_HEIGHT;

  // 4) High Score
  this.add.text(cx, y, `High Score: ${this.highScore}`, {
    fontSize: `${TEXT_SIZE}px`,
    color:    '#ffaa00'
  }).setOrigin(0.5);
  y += LINE_HEIGHT + PAD;

  // 5) Story paragraph (if any)
  if (this.story) {
    const storyBlock = this.add.text(cx, y, this.story, {
      fontSize: `${TEXT_SIZE}px`,
      color:    '#cccccc',
      align:    'center',
      wordWrap: { width: width * 0.75, useAdvancedWrap: true },
      lineSpacing: 4
    }).setOrigin(0.5, 0);
    y += storyBlock.height + STORY_PAD;
  } else {
    y += STORY_PAD;
  }

  // 6) Next Level button
  this.add.text(cx, y, '▶ Next Level', {
    fontSize: '20px',
    color: '#00ff00',
    backgroundColor: '#222',
    padding: { x:10, y:4 }
  })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerup', () => {
      this.scene.start('GraphPuzzleScene', { level: this.nextLevel });
    });
  y += LINE_HEIGHT + BTN_PAD;

  // 7) Main Menu button
  this.add.text(cx, y, '← Main Menu', {
    fontSize: '18px',
    color: '#00aaff',
    backgroundColor: '#222',
    padding: { x:8, y:4 }
  })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerup', () => {
      this.scene.start('MenuScene');
    });
  }
}