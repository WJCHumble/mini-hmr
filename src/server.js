const http = require("http")
const chokidar = require('chokidar');
const path = require("path")
const fs = require("fs")
const { createWebSocketServer } = require("./ws")

function createServer() {
	const httpServer = http.createServer(function(request, response) {
		const file = fs.readFileSync(path.join(__dirname, "../example/index.html"))
		response.writeHead(200, {'Content-Type': "text/html"})
		response.end(file.toString())
	})
	const wss = createWebSocketServer(httpServer)

	const watcher = chokidar.watch(path.join(__dirname, "../example/"))
	watcher.on("change", async (file) => {
		wss.send({
			type: "full-reload",
			updates: [file]
		})
	})

	httpServer.listen(3000)
	console.log("[min-hmr] server connected.")
	console.log("[min-hmr] listen 3000.")
}

createServer()