const http = require("http")
const WebSocket = require("ws")

function createWebSocketServer() {
	const wss = new WebSocket.Server({
		port: 24678,
	})

	wss.on("connection", (socket) => {
		socket.send(JSON.stringify({ type: "connected" }))
		console.log("ws")
	})

	wss.on("error", (e) => {
		if ( e.code !== "EADDRINUSE") {
			console.error(e.message)
		}
	})
}

function createServer() {
	const httpServer = http.createServer()

	createWebSocketServer()
	// const socket = new WebSocket("wss://localhost:24678", "min-hmr")
	// socket.addEventListener("message", async ({ data }) => {
	// 	console.log(JSON.parse(data))
	// })

	httpServer.listen(3000)
	console.log("[min-hmr] server connected.")
}

createServer()