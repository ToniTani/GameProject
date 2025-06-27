import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game-panel',
  width: 800,
  height: 600,
  backgroundColor: 0x000000,

  // 1) Crisp pixel-perfect rendering
  pixelArt: true,

  // 2) Render settings (disable smoothing)
  render: {
    antialias: false,
    antialiasGL: false
  },

  // 3) Match device pixel ratio (Retina support)
  resolution: window.devicePixelRatio,

  // 4) Scale manager: fit into parent, center both axes
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  // 5) Physics stub (you can also move this to main.js)
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  dom: {
    createContainer: true
  }
};