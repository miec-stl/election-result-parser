const fs = require("fs");
// TODO: update this library to use my own fork, at least until we get a version bump on the main package
const pdf = require("pdf-parse");

function loadAndParsePDF(pathToPDF) {
	return new Promise(async (resolve, reject) => {
		// TODO: handle if the parsing fails
		const dataBuffer = fs.readFileSync(pathToPDF);
		try {
			const data = await pdf(dataBuffer);
			const results = data.text.split("\n");
			return resolve(results.filter((val) => val.trim()));
		} catch (err) {
			return reject(err);
		}
	});
}

module.exports = {
	loadAndParsePDF
};
