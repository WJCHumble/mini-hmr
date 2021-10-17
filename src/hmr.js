export const handleHMRUpdate = (file, wss) => {
	if (file.endsWith(".css")) {
		wss.send({
			type: "update",
			updates: [file]
		})
		return
	}

	wss.send({
		type: "full-reload",
		updates: [file]
	})
}