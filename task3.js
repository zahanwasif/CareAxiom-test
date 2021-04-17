const express = require("express");
const rsvp = require("rsvp");
const Meta = require("html-metadata-parser");
const app = express();

const PORT = 5000;

const parserPromise = (url) => {
	return new rsvp.Promise((resolve, reject) => {
		const modifiedUrl = url.split("://").pop();
		try {
			Meta.parser(`https://${modifiedUrl}`, (err, res) => {
				if (err) {
					resolve(`<li> ${modifiedUrl} - NO RESPONSE </li>`);
				} else {
					resolve(`<li> ${modifiedUrl} - "${res.meta.title}" </li>`);
				}
			});
		} catch (err) {
			reject(err);
		}
	});
};

const getTitles = (urls = []) => {
	return new rsvp.Promise((resolve, reject) => {
		let urlsList = urls;
		if (!Array.isArray(urls)) {
			urlsList = [urls];
		}
		var response = [];
		urlsList.forEach((url) => {
			try {
				parserPromise(url).then((title) => {
					response.push(title);
					if (response.length === urlsList.length) {
						resolve(response);
					}
				});
			} catch (err) {
				reject(err);
			}
		});
	});
};

app.get("/I/want/title/", (req, res) => {
	let urls = req.query.address;
	if (urls) {
		getTitles(urls)
			.then((titles) => {
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
			})
			.catch((err) => console.log(err));
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
