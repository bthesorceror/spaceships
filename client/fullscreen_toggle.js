var inherits     = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

module.exports = FullscreenToggle;

inherits(FullscreenToggle, EventEmitter);

function FullscreenToggle() {
  EventEmitter.call(this);

  var self = this;

  window.addEventListener('resize', function() {
    self.signalChange();
  });
}

FullscreenToggle.prototype.signalChange = function() {
  if (this.isFullscreen()) {
    this.emit('on');
  } else {
    this.emit('off');
  }
}

FullscreenToggle.prototype.isFullscreen = function() {
  return document.webkitFullscreenElement;
}

FullscreenToggle.prototype.toggle = function() {
  if (this.isFullscreen()) {
    document.webkitExitFullscreen();
  } else {
    document.documentElement.webkitRequestFullscreen();
  }
}

