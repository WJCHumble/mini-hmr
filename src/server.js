const http = require("http")
const chokidar = require('chokidar');
const path = require("path")
const { createWebSocketServer } = require("./ws")
const serveStatic = require('serve-static')
const finalhandler = require('finalhandler')
const connect = require('connect');
const fs = require("fs")

const rootDir = path.join(__dirname, "../example/")
const alias = {
	js: 'application/javascript',
  css: 'text/css',
  html: 'text/html',
  json: 'application/json'
}
const serve = serveStatic(rootDir)
// use middlewares for server
const app = connect()

function createServer() {
	app.use(function(req, res, next) {
		serve(req, res, finalhandler(req, res))
		next()
	})
	app.use(function(req, res, next) {
		// transform "@" alias import
		if (req.url.includes("@")) {
			const code = fs.readFileSync(path.join(__dirname, "client.js")).toString()
			res.setHeader('Content-Type', alias["js"])
			res.end(code)
		}
	})
	const httpServer = http.createServer(app)
	const wss = createWebSocketServer(httpServer)

	const watcher = chokidar.watch(path.join(rootDir))
	watcher.on("change", async (file) => {
		wss.send({
			type: "full-reload",
			updates: [file]
		})
	})

	httpServer.listen(3000)
	console.log("[min-hmr] server connected.")
	console.log("> Local http://localhost:3000")
}

createServer()