const { readFileSync, readFile, writeFile } = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify")
const replaceTemplate = require("./modules/replaceTemplate")

// readFile("txt/start.txt", "utf8", (err, startResult) => {
//   readFile(`txt/${startResult}.txt`, "utf8", (err, readResult) => {
//     if (err) {
//       return console.error({ err });
//     }
//     readFile("txt/append.txt", "utf8", (err, appendResult) => {
//       const result = `${readResult}\nAAAAAAA\n${appendResult}`;
//       writeFile("txt/final.txt", result, "utf8", (err) => {
//         console.log("ok");
//       });
//     });
//   });
// });
// console.log("...loading Async...");

const tempOverview = readFileSync(`${__dirname}/templates/overview.html`, "utf-8")
const tempOverviewCard = readFileSync(`${__dirname}/templates/overview-card.html`, "utf-8")
const tempProduct = readFileSync(`${__dirname}/templates/product.html`, "utf-8")

const data = readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")
const dataObj = JSON.parse(data)

const slugs = dataObj.map(e => slugify(e.productName, { lower: true }))
console.log(slugs)

const server = http.createServer((req, res) => {
	const { pathname, query, path } = url.parse(req.url, true);
	switch (pathname) {

	// API
	case "/api": {
		res.writeHead(200, { "Content-type": "application/json" });
		res.end(data);
		break
	}

	// OVERVIEW
	case "/":
	case "/overview": {
		const cardsHtml = dataObj.map(obj => replaceTemplate(tempOverviewCard, obj)).join("")
		const overviewHtml = tempOverview.replace("%PRODUCT_CARDS%", cardsHtml)
		res.writeHead(200, { "Content-type": "text/html" });
		res.end(overviewHtml);
		break;
	}

	// PRODUCT
	case "/product": {
		const product = dataObj[query.id]
		const productHtml = replaceTemplate(tempProduct, product)
		res.writeHead(200, { "Content-type": "text/html" });
		res.end(productHtml);
		break;
	}

	// 404
	default: {
		res.writeHead(404, {
			"Content-type": "text/html",
			"My-Header": "wtf"
		});
		res.end(
			`<code style="
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 24px;"
			>
				<span style="color: red;">Error 404</span>
				<span>page not found!</span>
				<span>url:${path}</span>
			</code>`
		);
	}
  }
});

server.listen(8888, "127.0.0.1", () => {
  console.log("Listening to port 8888");
});
