export default class ScoreManager {
  
constructor(scene, thresholds = []) {
  this.scene        = scene;
  this.score        = 0;
  this.thresholds   = thresholds; // e.g. [4, 6, …] 
  this.currentLevel = 1;          // start on Level 1 
  this.scene.game.events.emit('update-score', this.score);
}

add(points) {
  this.score += points;
  this.scene.game.events.emit('update-score', this.score);
  this.checkProgress();
}

checkProgress() {
  const needed = this.thresholds[this.currentLevel - 1] ?? Infinity;
  if (this.score >= needed) {
    const nextLevel = this.currentLevel + 1; 
    this.scene.events.emit('level-complete', nextLevel);
  }
}

  reset() {
    this.score = 0;
    // optionally reset currentLevel too:
    // this.currentLevel = 0;
    this.scene.game.events.emit('update-score', this.score);
  }

  getScore() {
    return this.score;
  }

  getLevel() {
    return this.currentLevel;
  }
}