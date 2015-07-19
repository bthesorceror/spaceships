var domready = require('domready');

domready(function() {
  var canvas  = document.querySelector('#gameScreen');
  var context = canvas.getContext('2d');

  function draw() {
    var centerX = window.innerWidth / 2;
    var centerY = window.innerHeight / 2;

    context.save();
    context.fillStyle = '#00F';
    context.translate(centerX, centerY);
    context.beginPath();
    context.moveTo(0, -20);
    context.lineTo(20, 20);
    context.lineTo(-20, 20);
    context.closePath();
    context.fill();
    context.restore();
  }

  function resize() {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    draw();
  }

  window.addEventListener('resize', function(e) {
    resize();
  });

  resize();
});
