const { loadAndParsePDF } = require("./parser");

const parseSubHeader = (rawSubHeader, dataOrder) => {
	const subHeaderData = {};
	const splitSubHeader = rawSubHeader.split(/\s+/);
	console.log(splitSubHeader);
	let currentDataOrderIndex = 0;
	splitSubHeader.forEach((line) => {
		// check to see if this is a number
		if (Number(line.replace("%", ""))) {
			subHeaderData[dataOrder[currentDataOrderIndex]] = line;
			currentDataOrderIndex++;
		}
	});
	return subHeaderData;
};

/**
 * Takes in the main header data and returns the data in a useable form.
 * @param headerData string[] The first 10 elements of the parsed PDF, which contain the header info.
 * @return object An object containing info about the given PDF file.
 */
const parseHeaderData = (rawHeaderData) => {
	console.log(rawHeaderData);
	const headerData = {};
	headerData.electionDate = new Date(rawHeaderData[3]);
	headerData.processedDate = new Date(rawHeaderData[6]);
	headerData.processedTime = rawHeaderData[7].replace("Time:", "");
	const subHeaderDataOrder = ["registeredVoters", "numberVotesCast", "percentageVotesCast", "numPrecincts", "numPrecinctsReporting", "percentagePrecinctsReporting"];
	headerData.subHeaderData = parseSubHeader(rawHeaderData[9], subHeaderDataOrder);
	return headerData;
};

// After we get the info out of the header, we don't want to parse any of the headers
const removeHeaders = (parsedFile) => {
	// every time we see "Election Summary Report", there is a block of 10 lines that are the header
	let headerStartIndex = -1;
	for (let i = 0; i < parsedFile.length; i++) {
		if (parsedFile[i] === "Election Summary Report") {
			headerStartIndex = i;
			break;
		}
	}
	if (headerStartIndex >= 0) {
		parsedFile.splice(headerStartIndex, 10)
		return removeHeaders(parsedFile);
	}
	return parsedFile;
};

const findRaces = (splitFile) => {
	const fileRaces = [];
	// TODO: change this character based on OS (Windows should look for \r\n)
	const findRace = /^([A-Z]{2,})(\s[A-Z0-9]*[^a-z])*$/;
	splitFile.forEach((line) => {
		const searchResults = findRace.exec(line);
		if (!searchResults) return;
		fileRaces.push(searchResults[0]);
	});
	return fileRaces;
};

const raceHeaders = "Number of Precincts Precincts Reporting Times Counted Total Votes ";

(async () => {
	const fileName = process.argv[2];
	if (!fileName) {
		console.log("Usage: index [filename]");
		return;
	}
	const parsedFile = await loadAndParsePDF(fileName);
	// The first 10 lines are the main header
	const headerData = parseHeaderData(parsedFile.slice(0, 10));
	console.log(headerData);
	const noHeaderFile = removeHeaders(parsedFile);
	const fileRaces = findRaces(noHeaderFile);
	console.log("race info", fileRaces);
})();

// fs.readFile("elec-results-no-layout.txt", (err, file) => {
// fs.readFile(fileName, (err, file) => {
// 	if (err) {
// 		console.log("ERROR: ", err);
// 		return;
// 	}
// 	const fileData = file.toString();
// 	const splitFile = fileData.split("\n");
// 	const fileRaces = findRaces(splitFile);
// 	const raceOptions = {};
// 	fileRaces.forEach((race) => {
// 		raceOptions[race] = [];
// 	});
// 	console.log("Races: ", raceOptions);
// 	let nextLineHeader = false;
// 	splitFile.forEach((line) => {
// 		if (line === " " || line === "") {
// 			// this is a blank line in the PDF, we don't care about it.
// 			return;
// 		}
// 		console.log(line.slice(65));

// 		// if (nextLineHeader) {
// 		// 	nextLineHeader = false;
// 		// 	const removedHeaders = line.split(raceHeaders);
// 		// 	const unsplitOptions = removedHeaders[1];
// 		// 	console.log(unsplitOptions);
// 		// }
// 		// if (line in raceOptions) {
// 		// 	nextLineHeader = true;
// 		// }
// 	});
// });
