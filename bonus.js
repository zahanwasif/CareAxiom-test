const express = require("express");
const { from } = require("rxjs");
const { map, mergeMap } = require("rxjs/operators");
const Meta = require("html-metadata-parser");

const app = express();

const PORT = 5000;

const rxjsImplemet = (urls, sendResp) => {
	let urlsList = urls;
	if (!Array.isArray(urls)) {
		urlsList = [urls];
	}
	var listItems = [];
	const observable = from(urlsList).pipe(
		map((url) => {
			return url.split("://").pop();
		}),
		mergeMap((url) =>
			Meta.parser(`https://${url}`)
				.then((result) => `<li>${url} - "${result.meta.title}"</li>`)
				.catch(() => `<li>${url} - "NO RESPONSE"</li>`)
		)
	);
	const observer = {
		next: (data) => listItems.push(data),
		error: (err) => console.log(err),
		complete: () => sendResp(listItems),
	};

	observable.subscribe(observer);
};

app.get("/I/want/title/", (req, res) => {
	let urls = req.query.address;
	if (urls) {
		rxjsImplemet(urls, (titles) => {
			res.send(`<html>
            <head></head>     
            <body>
            <h1> Following are the titles of given websites: </h1>
            <ul>
            ${titles.map((title) => {
							return title;
						})}
            </ul>
            </body>
            </html>`);
		});
	} else {
		res.send(`
            <html>
            <head></head>
            <body>
            <h1> No URL is given </h1>
            </body>
            </html>
            `);
	}
});

app.use((req, res) => {
	res.sendStatus(404);
});

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
