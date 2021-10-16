import http from "http"
import chokidar from "chokidar"
import path from "path"
import { createWebSocketServer } from "./ws.js"
import serveStatic from "serve-static"
import finalhandler from "finalhandler"
import connect from "connect"
import fs from "fs"

const __dirname = path.resolve();
const rootDir = path.join(__dirname, "./example/")
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
			const code = fs.readFileSync(path.join(__dirname, "./src/client.js")).toString()
			res.setHeader('Content-Type', alias["js"])
			res.end(code)
		}
	})
	// TODO: transform css file to js file, such as use
	/**
	 *  import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/style.css");import { updateStyle, removeStyle } from "/@vite/client"
			const id = "/Users/wjc/Documents/FE/demos/vite-demo/style.css"
			const css = "#app {\n  font-family: Avenir, Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #2c3e50;\n  margin-top: 60px;\n}\n\n\ndiv {\n  background-color: #faa;\n}"
			updateStyle(id, css)
			import.meta.hot.accept()
			export default css
			import.meta.hot.prune(() => removeStyle(id))
	 */
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