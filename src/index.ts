import { loadAndParsePDF } from "./parser";
import {
	ContestResult,
	OptionData,
	ParsedWardResults,
	ReturnData,
	ContestResultsCollection,
	OptionDataCollection
} from "./types";
import { round } from "./utils";

const NUM_OF_WARDS = 28;

const parseSubHeader = (rawSubHeader: string, dataOrder: any) => {
	// TODO: type this
	const subHeaderData: any = {};
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
 * @param rawHeaderData string[] The first 10 elements of the parsed PDF, which contain the header info.
 * @return object An object containing info about the given PDF file.
 */
const parseHeaderData = (rawHeaderData: string[]) => {
	const subHeaderDataOrder = [
		"registeredVoters",
		"numberVotesCast",
		"percentageVotesCast",
		"numPrecincts",
		"numPrecinctsReporting",
		"percentagePrecinctsReporting"
	];
	// TODO: make a new headerdata type
	const headerData = {
		electionDate: new Date(rawHeaderData[3]),
		processedDate: new Date(rawHeaderData[6]),
		processedTime: rawHeaderData[7].replace("Time:", ""),
		subHeaderData: parseSubHeader(rawHeaderData[9], subHeaderDataOrder)
	};
	return headerData;
};

// After we get the info out of the header, we don't want to parse any of the headers
const removeHeaders = (parsedFile: string[]): string[] => {
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

const findContests = (splitFile: string[]) => {
	const fileContests: string[] = [];
	// TODO: change this character based on OS (Windows should look for \r\n)
	const findContest = /^([a-zA-Z.]{2,})(\s[A-Z0-9]*[^a-z])*$/;
	splitFile.forEach((line) => {
		const searchResults = findContest.exec(line);
		if (!searchResults) return;
		if (searchResults[0].includes("Total")) return;
		fileContests.push(searchResults[0]);
	});
	return fileContests;
};

const parseContest = (splitFile: string[], targetContest: string, nextContest: string) => {
	let bodyToParse: string[] = [];
	// the first two lines are the current contest and the string "Total" - remove these before doing anything else
	// TODO: Remove magic numbers
	splitFile.splice(0, 2);
	let endIndex = splitFile.indexOf(nextContest, 1);
	if (!nextContest) {
		endIndex = splitFile.length;
	}
	if (endIndex >= 0) {
		bodyToParse = splitFile.splice(0, endIndex);
	}
	// Now, on to the parsing
	// The first 4 lines contain info about total votes and such, and they're always the same
	const returnData: ContestResult = {
		totalVotes: 0,
		candidates: [],
		results: {},
		wardResults: {}
	};
	const stats = bodyToParse.splice(0, 4);
	const result = new RegExp(/([a-zA-Z' ]*) ([0-9]+)\/([0-9]+) ([0-9.]*\s*)%/).exec(stats[2]);
	if (result && result.length >= 5) {
		returnData.timesCounted = Number(result[2]);
		returnData.timesCountedPercentage = result[4];
	}
	const result2 = new RegExp(/([a-zA-Z ]*) ([0-9]+)/).exec(stats[3]);
	if (result2 && result2.length >= 3) {
		returnData.totalVotes = Number(result2[2]);
	}

	// Now, time to go through the candidates
	bodyToParse.forEach((line) => {
		const parsedLine = line.replace("\\", "");
		const result = new RegExp(/([-a-zA-Z' ]*) ([0-9]*) ([0-9.]*)%/).exec(parsedLine);
		if (result && result.length >= 4) {
			const optionData: OptionData = {
				numVotes: parseInt(result[2], 10),
				percentageVotes: result[3]
			};
			returnData.results[result[1]] = optionData;
			if (result[1] !== "Write-in Votes") {
				returnData.candidates.push(result[1]);
			}
		}
	});
	return returnData;
};

const loadPdfFromArgs = async () => {
	const fileName = process.argv[2];
	if (!fileName) {
		console.log("Usage: index [filename]");
		return false;
	}
	const parsedFile = await loadAndParsePDF(fileName);
	return parsedFile;
};

const createTotalResultsForContest = (contestResult: ContestResult) => {
	let totalVotes = 0;
	const totalResults: OptionDataCollection = {};
	for (const wardNumber in contestResult.wardResults) {
		const data = contestResult.wardResults[wardNumber];
		for (const option in data) {
			const optionData = data[option];
			totalVotes += optionData.numVotes;
			if (option in totalResults) {
				totalResults[option].numVotes += optionData.numVotes;
			} else {
				totalResults[option] = {
					numVotes: optionData.numVotes,
					// TODO: Loop through after we've made the totalResults object, and calc the percentage. There's a round function in utils.ts that should help w/ this
					percentageVotes: ""
				};
			}
		}
	}
	for (const result in totalResults) {
		const resultData = totalResults[result];
		let percentage = round((resultData.numVotes / totalVotes) * 100, 2).toString();
		if (percentage.indexOf(".") < 0) {
			percentage = `${percentage}.00`;
		}
		totalResults[result].percentageVotes = percentage;
	}
	contestResult.totalVotes = totalVotes;
	contestResult.results = totalResults;
	return contestResult;
};

const parseWardResults = (splicedFile: string[]) => {
	const returnData: ParsedWardResults = {};
	// const returnData = parseHeaderData(splicedFile.slice(0, 10));
	const noHeaderFile = removeHeaders(splicedFile);
	const fileContests = findContests(noHeaderFile);
	for (let i = 0; i < fileContests.length; i++) {
		if (i + 1 >= fileContests.length) {
			returnData[fileContests[i]] = parseContest(noHeaderFile, fileContests[i], "");
		} else {
			returnData[fileContests[i]] = parseContest(noHeaderFile, fileContests[i], fileContests[i + 1]);
		}
	}
	return returnData;
};

const splitWardFile = async () => {
	const parsedFile = await loadPdfFromArgs();

	const returnData: ReturnData = {
		results: {}
	};
	if (!parsedFile) {
		console.log("no parsed file");
		return;
	}
	for (let i = 1; i <= NUM_OF_WARDS; i++) {
		const currentWardStart = parsedFile.findIndex((line) => line.includes(`WARD ${i}`));
		let nextWardStart = parsedFile.length;
		if (i + 1 <= NUM_OF_WARDS) {
			nextWardStart = parsedFile.findIndex((line) => line.includes(`WARD ${i + 1}`)) - 4;
			if (nextWardStart < 0) {
				throw new Error("COULDN'T FIND NEXT WARD");
			}
		}
		if (currentWardStart >= 0) {
			// TODO: Name the '4' into a constant - no magic numbers
			const wardResults = parsedFile.splice(currentWardStart - 4, nextWardStart);
			const parsedWardResults = parseWardResults(wardResults);
			for (const contest in parsedWardResults) {
				const contestResults = parsedWardResults[contest];
				if (!(contest in returnData.results)) {
					returnData.results[contest] = {
						totalVotes: 0,
						candidates: [...contestResults.candidates],
						results: {},
						wardResults: {}
					};
				}
				returnData.results[contest].wardResults[i.toString()] = contestResults.results;
			}
		} else {
			console.log("NO WARD FOUND");
		}
	}
	for (const contest in returnData.results) {
		const data = returnData.results[contest];
		const combinedData = createTotalResultsForContest(data);
		returnData.results[contest] = combinedData;
	}
	console.log(JSON.stringify(returnData));
};

splitWardFile();
