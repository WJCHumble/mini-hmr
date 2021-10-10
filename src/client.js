const socket = new WebSocket("ws://localhost:3000", "min-hmr")
socket.addEventListener("message", async ({ data }) => {
	handleMessage(JSON.parse(data))
})
// TODO: 单个模块代码的改变
function handleMessage(payload) {
	switch (payload.type) {
		case 'update':
		case 'full-reload': 
			window.location.reload()
		default: {
			return payload
		}
	}
}

function fetchUpdate() {

}

const sheetsMap = new Map()
function updateStyle(id, content) {
	let	style = sheetsMap.get(id)
	if (!style) {
		style = new CSSStyleSheet()
		style.replaceSync(content)
		document.adoptedStyleSheets = [...document.adoptedStyleSheets, style]
	} else {
		style.replaceSync(content)
	}
}

module.exports = {
	updateStyle
}