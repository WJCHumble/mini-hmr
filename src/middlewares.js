import fs from "fs"
import path from "path"
import { __dirname, rootDir } from "./server.js"

const alias = {
	js: 'application/javascript',
  css: 'text/css',
  html: 'text/html',
  json: 'application/json'
}

export const transformAliasMiddleware = (req, res, next) => {
	// transform "@" alias import
	if (req.url.includes("@")) {
		const code = fs.readFileSync(path.join(__dirname, "./src/client.js")).toString()
		res.setHeader('Content-Type', alias["js"])
		res.end(code)
	}

	next()
}

export const transformCssMiddleware = (req, res) => {
	if (req.url.endsWith(".css")) {
		const absolutePath = path.join(rootDir, req.url)
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
}