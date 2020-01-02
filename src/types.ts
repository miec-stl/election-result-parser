export interface ReturnData {
	totalVotes?: number;
	results: ContestResultsCollection;
}

export interface ContestResultsCollection {
	[contestName: string]: ContestResult;
}

export interface OptionDataCollection {
	[optionName: string]: OptionData;
}

interface WardResultsCollection {
	[wardNumber: string]: OptionDataCollection;
}

export interface ContestResult {
	totalVotes: number;
	timesCounted?: number;
	timesCountedPercentage?: string;
	candidates: string[];
	results: OptionDataCollection;
	wardResults: WardResultsCollection;
}

export interface OptionData {
	numVotes: number;
	percentageVotes: string;
}

/**
 * Types used in the program, but not the return data itself
 */

export interface ParsedWardResults {
	[contestName: string]: ContestResult;
}
