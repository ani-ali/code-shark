const EventEmitter = require('events');

class IdleDetector extends EventEmitter {
  constructor(idleTime = 60000) { // Default 60 seconds
    super();
    this.idleTime = idleTime;
    this.idleTimer = null;
    this.isIdle = false;
  }

  start() {
    console.log(`Idle detector started. Will trigger after ${this.idleTime / 1000} seconds of inactivity.`);
    this.resetTimer();
  }

  resetTimer() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }

    this.isIdle = false;

    this.idleTimer = setTimeout(() => {
      this.isIdle = true;
      this.emit('idle');
    }, this.idleTime);
  }

  activity() {
    if (this.isIdle) {
      console.log('Activity detected, resetting idle timer...');
    }
    this.resetTimer();
  }

  stop() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    console.log('Idle detector stopped.');
  }
}

module.exports = IdleDetector;