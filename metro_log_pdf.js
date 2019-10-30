"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var loadAndParsePDF = require('./parser').loadAndParsePDF;
var underscore_1 = require("underscore");
var DataRow = /** @class */ (function () {
    function DataRow() {
    }
    return DataRow;
}());
module.exports = /** @class */ (function () {
    function MetroLogPDF(FilePath) {
        this.CALL_TYPES = [
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
            'MEDICAL EMERGENCY',
            'PLATFORM CHECK',
            'CRIMES FROM OTHER JURISDICTION',
            'SUPPLEMENTAL REPORT',
            'OFFICER IN NEED OF AIDE',
            'PROCESSING HARD DRIVE',
            'TRANSFER CHECK',
            'SPECIAL EVENT DETAIL',
            'SUMMONS RELEASE',
            'STADIUM DETAIL(NONE BASEBALL)',
            'INSPECTION',
            'STREET LEVEL CHECK',
            'BOMB THREAT'
        ];
        this.CALL_CATEGORIES = [
            'METROLINK',
            'FACILITIES',
            'METRO BUS ROUTE',
            'MO GRADE CROSSINGS',
            'IL GRADE CROSSINGS',
            'MILE MARKERS'
        ];
        this.FilePath = FilePath;
    }
    MetroLogPDF.prototype.ReadMetroPDF = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.FilePath) {
                            console.error("ERROR: No filename");
                            return [2 /*return*/, [[]]];
                        }
                        _a = this;
                        return [4 /*yield*/, loadAndParsePDF(this.FilePath)];
                    case 1:
                        _a.RawMetroFile = _b.sent();
                        this.ParsedMetroData = this.ReadAndParseMetroFile(this.RawMetroFile);
                        return [2 /*return*/, this.ParsedMetroData];
                }
            });
        });
    };
    MetroLogPDF.prototype.ReadAndParseMetroFile = function (MetroFile) {
        var OnlyDataRows = this.GetDataRows(MetroFile);
        // TODO: Also consider reading headers, getting dates, etc.
        return OnlyDataRows;
    };
    MetroLogPDF.prototype.GetDataRows = function (MetroFile) {
        var ReturnObject = [];
        for (var i = 0; i < MetroFile.length; i++) {
            var ThisPdfRow = MetroFile[i].trim();
            if (!this.CheckIfDataRow(ThisPdfRow)) {
                continue;
            }
            var FullSectionString = this.RecursivelyCheckNextRowsForData(ThisPdfRow, i);
            // console.error(FullSectionString);
            var ParsedPdfRow = this.ParsePdfString(FullSectionString);
            if (ParsedPdfRow !== false) {
                ReturnObject.push(ParsedPdfRow);
            }
        }
        return ReturnObject;
    };
    MetroLogPDF.prototype.CheckIfDataRow = function (PdfString) {
        var AmPmIndex;
        var CategoryIndex;
        AmPmIndex = PdfString.indexOf("am");
        if (AmPmIndex == -1) {
            AmPmIndex = PdfString.indexOf("pm");
        }
        for (var i = 0; i < this.CALL_CATEGORIES.length; i++) {
            CategoryIndex = PdfString.indexOf(this.CALL_CATEGORIES[i]);
            if (CategoryIndex != -1) {
                break;
            }
        }
        if (AmPmIndex != -1 && CategoryIndex != -1) {
            return true;
        }
        else {
            return false;
        }
    };
    MetroLogPDF.prototype.RecursivelyCheckNextRowsForData = function (CompoundingString, CurrentIndex) {
        var NextRowInFile = this.RawMetroFile[CurrentIndex + 1].trim();
        if (this.CheckIfDataRow(NextRowInFile)) {
            // If next row is a data row, we're done
            return CompoundingString;
        }
        else if (!isNaN(Date.parse(NextRowInFile))) {
            // If next row is entirely a date, that's the end of a page
            // (this is specific to the formatting of Metro's PDFs)
            return CompoundingString;
        }
        else {
            var CurrentCompoundedString = CompoundingString + " " + NextRowInFile;
            var NextCompoundedString = this.RecursivelyCheckNextRowsForData(CurrentCompoundedString, CurrentIndex + 1);
            if (NextCompoundedString == CompoundingString) {
                return CurrentCompoundedString;
            }
            else {
                return NextCompoundedString;
            }
        }
    };
    MetroLogPDF.prototype.ParsePdfString = function (PdfString) {
        var AmPmIndex;
        var CategoryIndex;
        var LocationIndex;
        var CallTypeIndex;
        var DateString;
        var Category;
        var CallType;
        var Location;
        // Find time information
        AmPmIndex = PdfString.indexOf("am");
        if (AmPmIndex == -1) {
            AmPmIndex = PdfString.indexOf("pm");
        }
        if (AmPmIndex == -1) {
            console.error("ERROR: No AM/PM string found: " + PdfString);
            return false;
        }
        DateString = PdfString.substring(0, AmPmIndex + 2);
        // Find category information
        for (var i = 0; i < this.CALL_CATEGORIES.length; i++) {
            CategoryIndex = PdfString.indexOf(this.CALL_CATEGORIES[i]);
            if (CategoryIndex != -1) {
                LocationIndex = CategoryIndex + this.CALL_CATEGORIES[i].length;
                Category = PdfString.substring(CategoryIndex, LocationIndex);
                break;
            }
        }
        if (CategoryIndex == -1) {
            console.error("ERROR: No category found: " + PdfString);
            Category = "MISSING CATEGORY";
        }
        // Find call type
        for (var i = 0; i < this.CALL_TYPES.length; i++) {
            CallTypeIndex = PdfString.indexOf(this.CALL_TYPES[i]);
            if (CallTypeIndex != -1) {
                CallType = PdfString.substring(CallTypeIndex).trim();
                break;
            }
        }
        if (CallTypeIndex == -1) {
            console.error("ERROR: No call type found: " + PdfString);
            CallType = "CALL TYPE LEFT EMPTY";
        }
        // Find location
        if (LocationIndex !== undefined) {
            if (CallTypeIndex == -1) {
                Location = PdfString.substring(LocationIndex + 3).trim(); // +3 because there's a " : " (usually?)
            }
            else {
                Location = PdfString.substring(LocationIndex + 3, CallTypeIndex);
            }
        }
        else {
            console.error("ERROR: No location found: " + PdfString);
            Location = "MISSING LOCATION";
        }
        return {
            Time: new Date(DateString),
            Category: Category,
            CallType: CallType,
            Location: Location
        };
    };
    MetroLogPDF.prototype.CountStatisticalData = function () {
        if (this.ParsedMetroData.length == 0) {
            console.error("No parsed data");
            return;
        }
        var CallsByType = underscore_1._.groupBy(this.ParsedMetroData, 'CallType');
        var CountCallsByType = underscore_1._.mapObject(CallsByType, function (CallsOfThisType) {
            return CallsOfThisType.length;
        });
        return CountCallsByType;
    };
    return MetroLogPDF;
}());
