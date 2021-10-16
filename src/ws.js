import WebSocket, { WebSocketServer }  from "ws"

export const createWebSocketServer = (wsServer) => {
	const wss = new WebSocketServer({ noServer: true })
	wsServer.on('upgrade', function upgrade(req, socket, head) {
		if (req.headers['sec-websocket-protocol'] === "min-hmr") {
			wss.handleUpgrade(req, socket, head, (ws) => {
				wss.emit('connection', ws, req)
			})
		}
	})

	wss.on('connection', (socket) => {
    socket.send(JSON.stringify({ type: 'connected' }))
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