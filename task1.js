const express = require("express");
const Meta = require("html-metadata-parser");
const app = express();

const PORT = 5000;

const parser = (url, callback) => {
	const modifiedUrl = url.split("://").pop();
	Meta.parser(`https://${modifiedUrl}`, (err, res) => {
		if (err) {
			callback(`<li> ${modifiedUrl} - NO RESPONSE </li>`);
		} else {
			callback(`<li> ${modifiedUrl} - "${res.meta.title}" </li>`);
		}
	});
};

const getTitles = (urls = [], responseCallback) => {
	let urlsList = urls;
	if (!Array.isArray(urls)) {
		urlsList = [urls];
	}
	var response = [];
	urlsList.forEach((url) => {
		parser(url, (title) => {
			response.push(title);
			if (response.length === urlsList.length) {
				responseCallback(response);
			}
		});
	});
};

app.get("/I/want/title/", (req, res) => {
	let urls = req.query.address;
	if (urls) {
		getTitles(urls, (titles) => {
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
