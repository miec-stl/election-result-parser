let MetroLogPDF = require('./metro_log_pdf');
const fs = require('fs');

const ReadAllDirectoryFiles = (DirectoryPath: string, EachDirectoryFunction: any/*, OnError: any*/) => {
    fs.readdir(DirectoryPath, (err: any, FileNameArray: string[]) => {
        if (err) {
            // OnError(err);
            console.log(err);
            return;
        }
        FileNameArray.forEach( (FileName: string) => {
            // console.log(FileName);
            EachDirectoryFunction(DirectoryPath+"/"+FileName);
        });
    });
}


ReadAllDirectoryFiles('test_dir', async (FilePath: string) => {
    const TestPDF = new MetroLogPDF(FilePath);
    const ParsedPdfData = await TestPDF.ReadMetroPDF();
    console.log(JSON.stringify(ParsedPdfData));
});

