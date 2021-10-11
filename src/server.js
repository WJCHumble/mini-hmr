const http = require("http")
const chokidar = require('chokidar');
const path = require("path")
const { createWebSocketServer } = require("./ws")
const serveStatic = require('serve-static')
const finalhandler = require('finalhandler')
const connect = require('connect');

const rootDir = path.join(__dirname, "../example/")
const serve = serveStatic(rootDir)
// TODO: use middlewares for server
const middlewares = connect()

function createServer() {
	const httpServer = http.createServer(function(req, res) {
		serve(req, res, finalhandler(req, res))
	})
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