const { loadAndParsePDF } = require("./parser");
const _ = require('underscore');

const startOfPageString = "Statement of Votes Cast";
const startOfRaceString = "CITYWIDE";

const loadPdfFromArgs = async () => {
	const fileName = process.argv[2];
	if (!fileName) {
		console.log("Usage: index [filename]");
		return false;
	}
	const parsedFile = await loadAndParsePDF(fileName);
	return parsedFile;
};

const splitPrecinctFile = async () => {
    const parsedFile = await loadPdfFromArgs();
    const formattedFile = formatData(parsedFile);
    console.log(JSON.stringify(formattedFile));
}

const formatData = (rawFileData) => {
    
    let formattedPages = [];
    let races = [];
    let raceNumber = -1;
    let skippingHeader = true;
    let thisPageRightCol = [];
    let thisPageLeftCol = [];
    let thisRaceInfo = [];
    

    for (let i=0; i < rawFileData.length; i++) {
        const thisRow = rawFileData[i];

        if (thisRow.substring(0,5) == 'Page:') {
            // Last line of header: start reading data
            skippingHeader = false;
            thisPageLeftCol = [];
            thisPageRightCol = [];
            continue;
        } else if (thisRow == startOfPageString) {
            thisPageRightCol.splice(0, thisPageLeftCol.length - thisPageRightCol.length);
            formattedPages.push(_.object(thisPageLeftCol, thisPageRightCol));
        } else if (thisRow == startOfRaceString) {
            // New race
            raceNumber++;
            races.push(thisRaceInfo);
            thisRaceInfo = [];
        }

        if (skippingHeader) {
            continue;
        } else {
            if (thisRow.substring(0,4) == "    ") {
                // We're in left column:
                if (thisRow.substring(0,6) == "    W ") {
                    currentPrecinct = thisRow.trim();
                }
                thisPageLeftCol.push(thisRow.trim());
            } else {
                thisPageRightCol.push(thisRow);
            }
        }
    }

    return formattedPages;
}

splitPrecinctFile();