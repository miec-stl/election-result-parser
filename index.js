const { loadAndParsePDF } = require("./parser");

const parseSubHeader = (rawSubHeader, dataOrder) => {
	const subHeaderData = {};
	const splitSubHeader = rawSubHeader.split(/\s+/);
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
	const headerData = {};
	headerData.electionDate = new Date(rawHeaderData[3]);
	headerData.processedDate = new Date(rawHeaderData[6]);
	headerData.processedTime = rawHeaderData[7].replace("Time:", "");
	const subHeaderDataOrder = [
		"registeredVoters",
		"numberVotesCast",
		"percentageVotesCast",
		"numPrecincts",
		"numPrecinctsReporting",
		"percentagePrecinctsReporting"
	];
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
		parsedFile.splice(headerStartIndex, 10);
		return removeHeaders(parsedFile);
	}
	return parsedFile;
};

const findRaces = (splitFile) => {
	const fileRaces = [];
	// TODO: change this character based on OS (Windows should look for \r\n)
	const findRace = /^([a-zA-Z.]{2,})(\s[A-Z0-9]*[^a-z])*$/;
	splitFile.forEach((line) => {
		const searchResults = findRace.exec(line);
		if (!searchResults) return;
		if (searchResults[0].includes("Total")) return;
		fileRaces.push(searchResults[0]);
	});
	return fileRaces;
};

const parseRace = (splitFile, targetRace, nextRace) => {
	let bodyToParse = [];
	// the first two lines are the current race and the string "Total" - remove these before doing anything else
	splitFile.splice(0, 2);
	let endIndex = splitFile.indexOf(nextRace, 1);
	if (!nextRace) {
		endIndex = splitFile.length;
	}
	if (endIndex >= 0) {
		bodyToParse = splitFile.splice(0, endIndex);
	}
	// Now, on to the parsing
	// The first 4 lines contain info about total votes and such, and they're always the same
	const returnData = {
		candidates: [],
		results: {}
	};
	const stats = bodyToParse.splice(0, 4);
	stats.forEach((line, index) => {
		switch (index) {
			case 2:
				const result = new RegExp(/([a-zA-Z' ]*) ([0-9]+)\/([0-9]+) ([0-9.]*\s*)%/).exec(line);
				if (result.length >= 5) {
					returnData.timesCounted = Number(result[2]);
					returnData.timesCountedPercentage = Number(result[4]);
				}
				break;
			case 3:
				const result2 = new RegExp(/([a-zA-Z ]*) ([0-9]+)/).exec(line);
				if (result2.length >= 3) {
					returnData.totalVotes = Number(result2[2]);
				}
				break;
			// This info has already been covered in other parts of the parser
			case 0:
			case 1:
				return;
		}
	});

	// Now, time to go through the candidates
	bodyToParse.forEach((line) => {
		const candidateData = {};
		const parsedLine = line.replace("\\", "");
		const result = new RegExp(/([-a-zA-Z' ]*) ([0-9]*) ([0-9.]*)%/).exec(parsedLine);
		if (result && result.length >= 4) {
			candidateData.numVotes = result[2];
			candidateData.percentageVotes = result[3];
			returnData.results[result[1]] = candidateData;
			if (result[1] !== "Write-in Votes") {
				returnData.candidates.push(result[1]);
			}
		}
	});
	return returnData;
};

(async () => {
	const fileName = process.argv[2];
	if (!fileName) {
		console.log("Usage: index [filename]");
		return;
	}
	const parsedFile = await loadAndParsePDF(fileName);
	// The first 10 lines are the main header
	const headerData = parseHeaderData(parsedFile.slice(0, 10));
	const noHeaderFile = removeHeaders(parsedFile);
	const fileRaces = findRaces(noHeaderFile);
	const raceData = {};
	for (let i = 0; i < fileRaces.length; i++) {
		if (i + 1 >= fileRaces.length) {
			raceData[fileRaces[i]] = parseRace(noHeaderFile, fileRaces[i], false);
		} else {
			raceData[fileRaces[i]] = parseRace(noHeaderFile, fileRaces[i], fileRaces[i + 1]);
		}
	}
	headerData.results = raceData;
	console.log(JSON.stringify(headerData));
})();
