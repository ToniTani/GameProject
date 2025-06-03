import './style.css';
import Phaser from 'phaser';
import GraphPuzzleScene from './scenes/GraphPuzzleScene.js';
import UIScene from './scenes/UIScene.js';
import gameConfig from './config/gameConfig.js';
import GameOverScene from './scenes/GameOverScene.js';
import LevelCompleteScene from './scenes/LevelCompleteScene.js';
import MenuScene from './scenes/MenuScene.js';

const config = {
  type: Phaser.AUTO,
  parent: gameConfig.parent,
  width: gameConfig.width,
  height: gameConfig.height,
  backgroundColor: gameConfig.backgroundColor,
  scene: [
    MenuScene,           // (optional) main menu
    GraphPuzzleScene,    // your puzzle
    UIScene,             // always active for UI overlay
    LevelCompleteScene,  // shows when you beat a level
    GameOverScene        // shows when time runs out
  ]
};

new Phaser.Game(config);