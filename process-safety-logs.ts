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
            console.log(JSON.stringify(_.union(AllFilesData)));
        });
    });    
}


ReadAllDirectoryFiles('input_2017', async (FilePath: string) => {
    const TestPDF = new MetroLogPDF(FilePath);
    const AllRows = await TestPDF.ReadMetroPDF();
    const PdfStatisticalData = TestPDF.CountStatisticalData();
    return AllRows;
});



