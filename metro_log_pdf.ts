
let { loadAndParsePDF } = require('./parser');

class DataRow {
    Time: Date;
    Category: string;
    CallType: string;
    Location: string;
}

module.exports = class MetroLogPDF {

    FilePath: string;
    ParsedPDF: string[][];
    
    constructor(FilePath: string) {
        this.FilePath = FilePath;
    }

    async ReadMetroPDF() {
        if (!this.FilePath) {
            console.log("ERROR: No filename");
            return [[]];
        }
        const RawMetroFile: string[] = await loadAndParsePDF(this.FilePath);
        const ParsedMetroData: DataRow[] = this.ReadAndParseMetroFile(RawMetroFile);
        return ParsedMetroData;
    }

    ReadAndParseMetroFile(MetroFile: string[]) {
        const OnlyDataRows: DataRow[] = this.GetDataRows(MetroFile);
        // TODO: Also consider reading headers, getting dates, etc.
        return OnlyDataRows;
    }

    GetDataRows(MetroFile: string[]) {
        const ReturnObject = [];
        
        for (let i = 0; i < MetroFile.length; i++) {
            const ThisPdfRow = MetroFile[i];
            const ParsedPdfRow: DataRow | false = this.ParsePdfString(ThisPdfRow);
            if (ParsedPdfRow !== false) {
                ReturnObject.push(ParsedPdfRow);
            }
        }

        return ReturnObject;
    }

    CheckIfDataRow(PdfString: string) {
        return true;
    }

    ParsePdfString(PdfString: string) {
        let AmPmIndex: number;
        let CategoryIndex: number;
        let LocationIndex: number;
        let CallTypeIndex: number;

        let DateString: string;
        let Category: string;
        let CallType: string;
        let Location: string;

        if (!this.CheckIfDataRow) {
            false;
        }

        // Find time information
        AmPmIndex = PdfString.indexOf("am");
        if (AmPmIndex == -1) { AmPmIndex = PdfString.indexOf("pm"); }
        if (AmPmIndex == -1) { 
            // console.error("ERROR: No AM/PM string found: "+PdfString); 
            return false;
        }
        DateString = PdfString.substring(0, AmPmIndex + 2);

        // Find category information
        for (let i = 0; i < this.CALL_CATEGORIES.length; i++) {
            CategoryIndex = PdfString.indexOf(this.CALL_CATEGORIES[i]);
            if (CategoryIndex != -1) {
                LocationIndex = CategoryIndex + this.CALL_CATEGORIES[i].length;
                Category = PdfString.substring(CategoryIndex, LocationIndex);
                break;
            }
        } 
        if (CategoryIndex == -1) { 
            console.error("ERROR: No category found: "+PdfString); 
            Category = "MISSING CATEGORY";
        }

        // Find call type
        for (let i = 0; i < this.CALL_TYPES.length; i++) {
            CallTypeIndex = PdfString.indexOf(this.CALL_TYPES[i]);
            if (CallTypeIndex != -1) {
                CallType = PdfString.substring(CallTypeIndex).trim();
                break;
            }
        }
        if (CallTypeIndex == -1) {
            console.error("ERROR: No call type found: "+PdfString);
            CallType = "CALL TYPE LEFT EMPTY";
        }

        // Find location
        if (LocationIndex !== undefined) {
            if (CallTypeIndex == -1) {
                Location = PdfString.substring(LocationIndex+3).trim(); // +3 because there's a " : " (usually?)
            } else {
                Location = PdfString.substring(LocationIndex+3, CallTypeIndex);
            }
        } else {
            console.error("ERROR: No location found: "+PdfString);
            Location = "MISSING LOCATION";
        }

        return {
            Time: new Date(DateString),
            Category: Category,
            CallType: CallType,
            Location: Location
        }
    }

    CALL_TYPES = [
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
        'PASSENGER ASSIST',
        'INDECENT EXPOSURE',
        'SMOKING ON PROPERTY',
        'LOITERING',
        'SUSPICIOUS /UNATTENDED  PACKAGE',
        'SUSPICIOUS /UNATTENDED PACKAGE',
        'WEAPONS VIOLATION',
        'INVESTIGATION',
        'SOLICITING',
        'ACCIDENT (BUS)',
        'COURTESY WARNING',
        'PERSON TRAPPED IN ELEVATOR',
        'OPEN CONTAINER ALCOHOL',
        'PROPERTY DAMAGE',
        'FOUND PROPERTY/ARTICLE',
        'ALARM',
        'OBSERVATION',
        'ABANDON VEHICLE',
        'SUSPICIOUS VEHICLE',
        'RESISTING',
        'FIGHT',
        'CHECK TRAIN FOR LOST PROPERTY',
        'MOTORIST ASSIST',
        'VANDALISM',
        'CONVEYANCE',
        'ATTEMPT ROBBERY',
        'FIRE',
        'STATION ASSIGNMENT',
        'MISSING PERSON',
        'GAMBLING',
        'CITATION ISSUE',
        'RECOVERED PROPERTY',
        'ACCIDENT (CAR)',
        'ANIMAL AT LARGE',
        'DRINKING ON TRAIN',
        'SUICIDAL SUBJECT',
        'ROBBERY',
        'CONTACT COMPLAINTANT',
        'PANHANDLING',
        'ACCIDENT (TRAIN)',
        'ORDINANCE VIOLATION',
        'POSSIBLE STOLEN VEHICLE',
        'ASSIST',
        'PARKING VIOLATION',
        'FLOURISHING',
        'UNRULY PATRON',
        'PERSON DOWN',
        'ACCIDENT (AGENCY VEHICLE)',
        'STOLEN PROPERTY',
        'ESCORT',
        'UNFOUNDED',
        'BICYCLE/SCOOTER REMOVAL',
        'TOWED VEHICLE',
        'SHOOTING',
        'PERSON STRUCK',
        'PEDESTRIAN CHECK',
        'OPERATOR CONTACT',
        'UNSECURE DOOR',
        'MEDICAL EMERGENCY'
    ]

    CALL_CATEGORIES = [
        'METROLINK',
        'FACILITIES',
        'METRO BUS ROUTE',
        'MO GRADE CROSSINGS',
        'IL GRADE CROSSINGS',
        'MILE MARKERS'
    ];
}
