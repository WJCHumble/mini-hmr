import fs from "fs"
import path from "path"
import { __dirname, rootDir, port } from "./server.js"

const alias = {
	js: 'application/javascript',
  css: 'text/css',
  html: 'text/html',
  json: 'application/json'
}

export const transformAliasMiddleware = (req, res, next) => {
	// transform "@" alias import
	const requestUrl = req.url
	if (requestUrl.includes("@")) {
		const relativePath = requestUrl.replace(/\@vite/g, "src")
		let code = fs.readFileSync(path.join(__dirname, relativePath)).toString()

		if (requestUrl.includes("client.js")) {
			// replace __HMR_PORT__
			code = code.replace("__HMR_PORT__", port)
		}

		res.setHeader('Content-Type', alias["js"])
		res.end(code)
	}

	next()
}

export const transformCssMiddleware = (req, res) => {
	if (!req.url.includes(".css")) return
	
	const [relativePath, query] = req.url.split("?")
	const absolutePath = path.join(rootDir, relativePath)
	const css = fs.readFileSync(absolutePath).toString()
	const code = `import { updateStyle } from "/@vite/client.js"
const id = "${absolutePath}"
const css = "${css.replace(/\n/g, "")}"
updateStyle(id, css)
export default css
	`

	res.setHeader('Content-Type', alias["js"])
	res.end(code)
}