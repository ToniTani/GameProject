import './style.css';
import Phaser, { Physics } from 'phaser';
import GraphPuzzleScene from './scenes/GraphPuzzleScene.js';
import UIScene from './scenes/UIScene.js';
import gameConfig from './config/gameConfig.js';
import GameOverScene from './scenes/GameOverScene.js';
import LevelCompleteScene from './scenes/LevelCompleteScene.js';
import MenuScene from './scenes/MenuScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import LightningPipeline from './pipelines/LightningPipeline.js';

const config = {
  type: Phaser.AUTO,
  parent: gameConfig.parent,
  width: gameConfig.width,
  height: gameConfig.height,
  backgroundColor: gameConfig.backgroundColor,
  pipeline: {
    Lightning: LightningPipeline
  },

  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 } }
  },

  scale: {
    mode:       Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  scene: [
    PreloadScene,
    MenuScene,
    GraphPuzzleScene,
    UIScene,
    LevelCompleteScene,
    GameOverScene
  ]
};

new Phaser.Game(config);