var stack = require('stack')
var ecstatic = require('ecstatic')
var http = require('http')
var fs = require('fs')
var path = require('path')

function handler (req, res, next) {
  if (req.url !== '/') return next()

  res.writeHead(200, {
    'Content-Type': 'text/html'
  })

  fs.createReadStream(path.join(__dirname, '/index.html')).pipe(res)
}

var server = http.createServer(stack(
  handler,
  ecstatic(path.join(__dirname, '/public'))
))

server.listen(process.env.PORT || 8080)
