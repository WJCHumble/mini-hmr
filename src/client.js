const socket = new WebSocket("ws://localhost:3000", "min-hmr")
socket.addEventListener("message", async ({ data }) => {
	handleMessage(JSON.parse(data))
})
// TODO: 单个模块代码的改变
function handleMessage(payload) {
	switch (payload.type) {
		case 'update':
			// TODO: fetchUpdate Module
			break;
		case 'full-reload': 
			window.location.reload()
			break;
		default: {
			return payload
		}
	}
}

function fetchUpdate(path) {}

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