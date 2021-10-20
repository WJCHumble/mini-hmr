export const handleHMRUpdate = (file, wss) => {
	const timestamp = Date.now()
	if (file.endsWith(".css")) {
		wss.send({
			type: "update",
			updates: [{
				path: file,
				timestamp,
			}]
		})
		return
	}

	wss.send({
		type: "full-reload",
		updates: [{
			path: file,
			timestamp
		}]
	})
}