import fs from "fs";
import pdf from "pdf-parse";

// TODO: this typing should go into a type file for the pdf parse library itself, not here
interface PdfParseReturnData {
	info: any;
	metadata: any;
	numpages: number;
	numrender: number;
	text: string;
	version: string;
}

export function loadAndParsePDF(pathToPDF: string) {
	return new Promise<string[]>(async (resolve, reject) => {
		// TODO: handle if the parsing fails
		const dataBuffer = fs.readFileSync(pathToPDF);
		try {
			const data: PdfParseReturnData = await pdf(dataBuffer);
			const results = data.text.split("\n");
			return resolve(results.filter((val) => val.trim()));
		} catch (err) {
			return reject(err);
		}
	});
}
