const { loadAndParsePDF } = require('./parser');
const fs = require('fs');

const ReadAllDirectoryFiles = (DirectoryPath: string, EachDirectoryFunction: any/*, OnError: any*/) => {
    fs.readdir(DirectoryPath, (err: any, FileNameArray: string[]) => {
        if (err) {
            // OnError(err);
            console.log(err);
            return;
        }
        FileNameArray.forEach( (FileName: string) => {
            console.log(FileName);
            EachDirectoryFunction(DirectoryPath+"/"+FileName);
        });
    });
}

const ReadMetroPDF = async (FileName: string) => {
    if (!FileName) {
        console.log("ERROR: No filename");
        return false;
    }

    const RawMetroFile: string[] = await loadAndParsePDF(FileName);
    const ParsedMetroFile: string[][] = 
    console.log(RawMetroFile);
}

ReadAllDirectoryFiles('test_dir', ReadMetroPDF); 

console.log('asdf');
