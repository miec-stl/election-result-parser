const { loadAndParsePDF } = require("./parser");

const StartOfPageString = "Statement of Votes Cast";

const RemoveHeaders = (RawFileData) => {
    const ElectionData = [[]];

    let ContinueSkipping = true;
    let ThisPage = 0;

    for (let i = 0; i < RawFileData.length; i++) {
        const Row = RawFileData[i];
        
        if (Row.substring(0, 5) == 'Page:') {
            ContinueSkipping = false;
            ThisPage++;
            ElectionData.push([]);
            continue;
        } else if (Row == StartOfPageString) {
            ContinueSkipping = true;
        }

        if (ContinueSkipping) {
            continue;
        } else {
            ElectionData[ThisPage].push(Row);
        }        
    }

    return ElectionData;
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