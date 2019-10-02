const fs = require("fs");
// TODO: update this library to use my own fork, at least until we get a version bump on the main package
const pdf = require("pdf-parse");

const dataBuffer = fs.readFileSync("./election_results.pdf");

function loadAndParsePDF(pathToPDF) {
	return new Promise((resolve, reject) => {
		// TODO: handle if the parsing fails
		const dataBuffer = fs.readFileSync(pathToPDF);
		pdf(dataBuffer).then((data) => {
			const results = data.text.split("\n");
			return resolve(results.filter((val) => val.trim()));
		});
	});
}

module.exports = {
	loadAndParsePDF
}
