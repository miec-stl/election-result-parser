let MetroLogPDF = require('./metro_log_pdf');
const fs = require('fs');
import { _ } from 'underscore';

let ReadAllDirectoryFiles = (DirectoryPath: string, EachDirectoryFunction: any/*, OnError: any*/) => {
    let FileNameArray: string[];
    let FilePromises: Promise<any>[] = [];


    fs.readdir(DirectoryPath, (err: any, FileNames: string[]) => {
        FileNameArray = FileNames;
        if (err) {
            console.log(err);
            return;
        }
        FileNames.forEach( async (FileName: string) => {
            FilePromises.push(new Promise( (resolve, reject) => {
                resolve(EachDirectoryFunction(DirectoryPath+"/"+FileName));
            }));
        });

        Promise.all(FilePromises).then( (AllFilesData) => {
            console.log(JSON.stringify(_.object(FileNameArray, AllFilesData)));
        });
    });    
}


ReadAllDirectoryFiles('test_dir', async (FilePath: string) => {
    const TestPDF = new MetroLogPDF(FilePath);
    await TestPDF.ReadMetroPDF();
    const PdfStatisticalData = TestPDF.CountStatisticalData();
    return PdfStatisticalData;
});



