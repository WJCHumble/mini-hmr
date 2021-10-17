import http from "http"
import chokidar from "chokidar"
import path from "path"
import { createWebSocketServer } from "./ws.js"
import serveStatic from "serve-static"
import finalhandler from "finalhandler"
import connect from "connect"
import { handleHMRUpdate } from "./hmr.js"
import { transformAliasMiddleware, transformCssMiddleware } from "./middlewares.js"

export const __dirname = path.resolve();
export const rootDir = path.join(__dirname, "./example/")
const serve = serveStatic(rootDir)
// use middlewares for server
const app = connect()

function createServer() {
	app.use(function(req, res, next) {
		serve(req, res, finalhandler(req, res))
		next()
	})
	app.use(transformAliasMiddleware)
	app.use(transformCssMiddleware)
	const httpServer = http.createServer(app)
	const wss = createWebSocketServer(httpServer)

	const watcher = chokidar.watch(path.join(rootDir))
	watcher.on("change", async (file) => {
		handleHMRUpdate(file, wss)
	})

	httpServer.listen(3000)
	console.log("[min-hmr] server connected.")
	console.log("> Local http://localhost:3000")
}

createServer()