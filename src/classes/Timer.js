export default class Timer {
  /**
   * @param {Phaser.Scene} scene  - the scene to tie into
   * @param {number} startSeconds - initial time in seconds
   */
  constructor(scene, startSeconds) {
    this.scene = scene;
    this.timeLeft = startSeconds;
    // Emit initial timer value to UI
    this.scene.game.events.emit('update-timer', this.timeLeft);

    // Create a repeating Phaser.TimerEvent
    this.timerEvent = scene.time.addEvent({
      delay: 1000,
      callback: this.tick,
      callbackScope: this,
      loop: true
    });
  }

  /**
   * Decrements the timer and emits updates.
   * Stops and signals when time runs out.
   */
  tick() {
    this.timeLeft--;
    // Update UI with new time
    this.scene.game.events.emit('update-timer', this.timeLeft);

    if (this.timeLeft <= 0) {
      // Stop the timer
      this.timerEvent.remove(false);
      // Inform the scene that time is up
      this.scene.events.emit('time-up');
    }
  }

  /**
   * Stop the timer early if needed
   */
  stop() {
    if (this.timerEvent) {
      this.timerEvent.remove(false);
    }
  }
}
