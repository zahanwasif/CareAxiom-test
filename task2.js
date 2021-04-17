const express = require("express");
const Meta = require("html-metadata-parser");
const app = express();
const async = require("async");

const PORT = 5000;

const asyncFetch = (urls = [], responseCallback) => {
	var response = [];
	async.each(
		urls,
		(url, callback) => {
			const modifiedUrl = url.split("://").pop();
			Meta.parser(`https://${modifiedUrl}`, (err, res) => {
				if (err) {
					response.push(`<li> ${modifiedUrl} - NO RESPONSE </li>`);
				} else {
					response.push(`<li> ${modifiedUrl} - "${res.meta.title}" </li>`);
				}
				callback();
			});
		},
		(err) => {
			if (err) {
			} else {
				responseCallback(response);
			}
		}
	);
};

app.get("/I/want/title/", (req, res) => {
	let urls = req.query.address;
	if (urls) {
		var urlsList = urls;
		if (!Array.isArray(urls)) {
			urlsList = [urls];
		}
		asyncFetch(urlsList, (titles) => {
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

app.listen(PORT);
