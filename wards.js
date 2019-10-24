const { loadAndParsePDF } = require("./parser");

const StartOfPageString = "Statement of Votes Cast";
const StartOfNewRaceString = "CITYWIDE";

const RemoveHeaders = (RawFileData) => {
    const ReturnPages = [];
    const LeftColumns = [];
    const RightColumns = [];
    const Races = [];

    let SkippingHeader = true;
    let IndexOnPage = 0;
    let RaceNumber = -1;
    let CurrentPrecinct;
    let ThisPageLeftColumn = [];
    let ThisPageRightColumn = [];
    let ThisRaceInfo = [];

    for (let i = 0; i < RawFileData.length; i++) {
        const Row = RawFileData[i];
        
        if (Row.substring(0, 5) == 'Page:') {
            SkippingHeader = false;
            ThisPageLeftColumn = [];
            ThisPageRightColumn = [];
            continue;
        } else if (Row == StartOfPageString) {
            ThisPageRightColumn.splice(0, ThisPageLeftColumn.length - ThisPageRightColumn.length);
            ReturnPages.push({LeftColumn:ThisPageLeftColumn, RightColumn:ThisPageRightColumn, LL:ThisPageLeftColumn.length, RR:ThisPageRightColumn.length});
            SkippingHeader = true;
        } else if (Row == StartOfNewRaceString) {
            // We're looking at a new race
            RaceNumber++;
            Races.push(ThisRaceInfo);
            ThisRaceInfo = [];
        }

        if (SkippingHeader) {
            continue;
        } else {
            if (Row.substring(0,4) == "    ") {
                // We're in the left column
                if(Row.substring(0,6) == "    W ") {
                    CurrentPrecinct = Row.trim();
                }
                ThisPageLeftColumn.push(Row.trim());
            } else {
                ThisPageRightColumn.push(Row);
            }
            // ElectionData.push(Row);
        }        
    }

    return ReturnPages;
}

(async () => {
    const FileName = process.argv[2];
    if(!FileName) {
        console.log("Usage: index [FileName]");
        return;
    }
    const ParsedFile = await loadAndParsePDF(FileName);
    const FileData = RemoveHeaders(ParsedFile);
    console.log(JSON.stringify(FileData));
})();