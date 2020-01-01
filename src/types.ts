export interface ReturnData {
	totalVotes?: number;
	results?: ContestResultsCollection;
}

export interface ContestResultsCollection {
	[contestName: string]: ContestResult;
}

export interface OptionDataCollection {
	[optionName: string]: OptionData;
}

export interface WardResultsCollection {
	[wardNumber: string]: OptionDataCollection;
}

export interface ContestResult {
	totalVotes?: number;
	results?: OptionDataCollection;
	wardResults?: WardResultsCollection;
}

export interface OptionData {
	numVotes: number;
	percentageVotes: string;
}
