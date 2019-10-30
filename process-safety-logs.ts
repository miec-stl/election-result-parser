let MetroLogPDF = require('./metro_log_pdf');
const fs = require('fs');

const ReadAllDirectoryFiles = (DirectoryPath: string, EachDirectoryFunction: any/*, OnError: any*/) => {
    let AllFilesData = {};

    fs.readdir(DirectoryPath, (err: any, FileNameArray: string[]) => {
        if (err) {
            // OnError(err);
            console.log(err);
            return;
        }
        FileNameArray.forEach( async (FileName: string) => {
            // console.log(FileName);
            AllFilesData[FileName] = await EachDirectoryFunction(DirectoryPath+"/"+FileName);
            if (FileName == FileNameArray[FileNameArray.length - 1]) {
                console.log(JSON.stringify(AllFilesData));
            }
        });
    });
    
}


ReadAllDirectoryFiles('test_dir', async (FilePath: string) => {
    const TestPDF = new MetroLogPDF(FilePath);
    const ParsedPdfData = await TestPDF.ReadMetroPDF();
    const PdfStatisticalData = TestPDF.CountStatisticalData();
    // console.log(JSON.stringify(PdfStatisticalData));
    // console.log(JSON.stringify(ParsedPdfData));
    return PdfStatisticalData;
});

