interface ReturnData {
	totalVotes?: number;
	results?: ContestResultsCollection;
}

interface ContestResultsCollection {
	[contestName: string]: ContestResult;
}

interface OptionDataCollection {
	[optionName: string]: OptionData;
}

interface WardResultsCollection {
	[wardNumber: string]: OptionDataCollection;
}

interface ContestResult {
	totalVotes?: number;
	results?: OptionDataCollection;
	wardResults?: WardResultsCollection;
}

interface OptionData {
	numVotes: number;
	percentageVotes: string;
}
