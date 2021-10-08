const http = require("http")
const { WebSocket } = require("ws")
const chokidar = require('chokidar');
const path = require("path")
const fs = require("fs")

function createWebSocketServer() {
	const wss = new WebSocket.Server({ noServer: true })
	wss.on("connection", (socket) => {
		socket.send(JSON.stringify({ type: "connected" }))
		console.log("ws")
	})

	wss.on("error", (e) => {
		if ( e.code !== "EADDRINUSE") {
			console.error(e.message)
		}
	})

	return {
		send(payload) {
			const stringified = JSON.stringify(payload)
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(stringified)
        }
      })
		}
	}
}

function createServer() {
	const httpServer = http.createServer(function(request, response) {
		const file = fs.readFileSync(path.join(__dirname, "../example/index.html"))
		response.writeHead(200, {'Content-Type': "text/html"})
		response.end(file)
	})
	const wss = createWebSocketServer()

	const watcher = chokidar.watch(path.join(__dirname, "../example/"))
	watcher.on("change", async (file) => {
		wss.send({
			type: "full-reload",
			updates: [file]
		})
	})

	httpServer.listen(3000)
	console.log("[min-hmr] server connected.")
}

createServer()