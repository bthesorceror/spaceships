var inherits     = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

module.exports = FullscreenToggle;

inherits(FullscreenToggle, EventEmitter);

function FullscreenToggle() {
  EventEmitter.call(this);
}

FullscreenToggle.prototype.isFullscreen = function() {
  return document.webkitFullscreenElement;
}

FullscreenToggle.prototype.toggle = function() {
  if (this.isFullscreen()) {
    document.webkitExitFullscreen();
    this.emit('off');
  } else {
    document.documentElement.webkitRequestFullscreen();
    this.emit('on');
  }
}

