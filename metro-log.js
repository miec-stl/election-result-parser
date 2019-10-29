const { loadAndParsePDF } = require('./parser');

const GetCallInfo = (StringFromPDF) => {
    let ReturnObject = {};
    let CategoryIndex = 0;
    let LocationIndex = 0;
    let CallTypeIndex = 0;

    for (i = 0; i < CALL_CATEGORIES.length; i++) {
        CategoryIndex = StringFromPDF.indexOf(CALL_CATEGORIES[i]);
        if (CategoryIndex != -1) {
            LocationIndex = CategoryIndex + CALL_CATEGORIES[i].length;
            ReturnObject['Category'] = StringFromPDF.substring(CategoryIndex, LocationIndex);
            break;
        }
    }

    for (i = 0; i < CALL_TYPES.length; i++) {
        CallTypeIndex = StringFromPDF.indexOf(CALL_TYPES[i]);
        if(CallTypeIndex != -1) {
            ReturnObject['CallType'] = StringFromPDF.substring(CallTypeIndex);
            break;
        }
    } 

    if (LocationIndex !== 0) {
        if (CallTypeIndex == -1) {
            ReturnObject['Location'] = StringFromPDF.substring(LocationIndex+3);
        } else {
            ReturnObject['Location'] = StringFromPDF.substring(LocationIndex+3, CallTypeIndex);
        }
    }

    return ReturnObject;

}

const GetCallTime = (StringFromPDF) => {
    let AmPmIndex = StringFromPDF.indexOf("am");

    if (AmPmIndex == -1) {
        AmPmIndex = StringFromPDF.indexOf("pm");
    }

    if (AmPmIndex == -1) {
        return false;
    }    
        
    return Date.parse(StringFromPDF.substring(0, AmPmIndex + 2));
}

const GetDataRowInfo = (StringFromPDF) => {

    const TimeString = GetCallTime(StringFromPDF);
    const CallInfoParsed = GetCallInfo(StringFromPDF);

    return {
        Time:TimeString,
        Category:CallInfoParsed['Category'],
        CallType:CallInfoParsed['CallType'],
        Location:CallInfoParsed['Location'],
    }
    
}

const RecursivelyCheckNextRowsForData = (CompoundingRow, parsedFile, CurrentIndex) => {
    const NextRow = parsedFile[CurrentIndex + 1];
    if (GetCallTime(NextRow) != false) {
        return CompoundingRow;
    } else if (!isNaN(Date.parse(NextRow))) {
        return CompoundingRow;
    } else {
        // This is another data row we want to append, let's check the next row
        let YetAnotherRow = RecursivelyCheckNextRowsForData(CompoundingRow+" "+NextRow, parsedFile, CurrentIndex+1);
        if (YetAnotherRow == CompoundingRow+" "+NextRow) {
            return CompoundingRow+" "+NextRow;
        } else {
            return YetAnotherRow;
        }
    }
}

const loadPdfFromArgs = async () => {
	const fileName = process.argv[2];
	if (!fileName) {
		console.log("Usage: index [filename]");
		return false;
	}
    const parsedFile = await loadAndParsePDF(fileName);
    const ReturnFile = [];
    let SkippingHeader = true;
    for (let i = 0; i < parsedFile.length; i++) {
        let StringFromPDF = parsedFile[i];
        if (SkippingHeader && GetCallTime(StringFromPDF) !== false) {
            SkippingHeader = false;
        } else if (SkippingHeader) {
            continue;
        } else if (!SkippingHeader && Date.parse(StringFromPDF) !== NaN) {
            SkippingHeader = true;
        }
        
        if (!SkippingHeader && GetCallTime(StringFromPDF)) {
            let FullDataRow = RecursivelyCheckNextRowsForData(StringFromPDF, parsedFile, i);
            ReturnFile.push(FullDataRow);
            // console.log(FullDataRow);
        }
    }
	return ReturnFile;
}

const processFile = async () => {
	const FileData = await loadPdfFromArgs();
	if (!FileData) {
		return;
    }
    // console.log(FileData);

    for (let i = 0; i < FileData.length; i++) {
        const ThisRowData = FileData[i];
        let ThisCallInfo = GetDataRowInfo(ThisRowData);
        if (!ThisCallInfo) {
            console.log(JSON.stringify(ThisRowData));
        } else {
            console.log(JSON.stringify(ThisCallInfo));
        }
    }
	// The first 10 lines are the main header
	// const headerData = parseHeaderData(parsedFile.slice(0, 10));
	// const noHeaderFile = removeHeaders(parsedFile);
	// const fileRaces = findRaces(noHeaderFile);
	// const raceData = {};
	// for (let i = 0; i < fileRaces.length; i++) {
	// 	if (i + 1 >= fileRaces.length) {
	// 		raceData[fileRaces[i]] = parseRace(noHeaderFile, fileRaces[i], false);
	// 	} else {
	// 		raceData[fileRaces[i]] = parseRace(noHeaderFile, fileRaces[i], fileRaces[i + 1]);
	// 	}
	// }
	// headerData.results = raceData;
	// console.log(JSON.stringify(headerData));
};

processFile();

const CALL_CATEGORIES = [
    'METROLINK',
    'FACILITIES',
    'METRO BUS ROUTE'
]

const CALL_TYPES = [
    'FARE VIOLATION',
    'FARE DISPUTE',
    'DISTURBANCE',
    'SICK CASE',
    'PASSENGER REMOVAL',
    'SMOKING ON TRAIN',
    'TRESPASSER',
    'SLEEPER',
    'ARREST',
    'LOST PROPERTY/ARTICLE',
    'THEFT',
    'ASSAULT',
    'CHECK THE WELFARE',
    'SUSPICIOUS/UNATTENDED PACKAGE',
    'ASSISTING OTHER AGENCY',
    'SUSP PERSON',
    'BUILDING CHECK',
    'ACCIDENTAL INJURY',
    'INTOXICATED SUBJECT',
    'CONDITION ID',
    'JUVENILE COMPLAINT',
    'PUBLIC URINATION',
    'DRUG VIOLATION',
    'SHOTS FIRED',
    'ASSIST',
    'INDECENT EXPOSURE',
    'SMOKING ON PROPERTY',
    'LOITERING',
    'SUSPICIOUS /UNATTENDED  PACKAGE',
    'WEAPONS VIOLATION',
    'INVESTIGATION',
    'SOLICITING',
    'ACCIDENT (BUS)',
    'COURTESY WARNING',
    'BUS STALL',
]