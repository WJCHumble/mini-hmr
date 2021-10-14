const http = require("http")
const chokidar = require('chokidar');
const path = require("path")
const { createWebSocketServer } = require("./ws")
const serveStatic = require('serve-static')
const finalhandler = require('finalhandler')
const connect = require('connect');

const rootDir = path.join(__dirname, "../example/")
const serve = serveStatic(rootDir)
// use middlewares for server
const app = connect()

function createServer() {
	app.use(function(req, res, next) {
		serve(req, res, finalhandler(req, res))
		next()
	})
	app.use(function(req, res, next) {
		if (req.url.includes("@")) {
			req.url = "./client.js"
			next(req, res, next)
		}
		next()
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