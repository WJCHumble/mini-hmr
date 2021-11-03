const socket = new WebSocket("ws://localhost:__HMR_PORT__", "min-hmr")
socket.addEventListener("message", async ({ data }) => {
	handleMessage(JSON.parse(data))
})

function handleMessage(payload) {
	switch (payload.type) {
		case 'update':
			payload.updates.forEach((update) => {
				fetchUpdate(update)
			})
			break;
		case 'full-reload': 
			window.location.reload()
			break;
		default: {
			return payload
		}
	}
}

async function fetchUpdate({ path, timestamp }) {
	const [relativePath, query] = path.split("?")
	try {
		const url = `/${relativePath}?t=${timestamp}${query ? `&${query}` : ''}`
		await import(url)
	} catch (e) {
		console.error(e)
	}
}

const sheetsMap = new Map()
export const updateStyle = (id, content) => {
	let	style = sheetsMap.get(id)
	if (!style) {
		style = new CSSStyleSheet()
		style.replaceSync(content)
		document.adoptedStyleSheets = [...document.adoptedStyleSheets, style]
	} else {
		style.replaceSync(content)
	}
}