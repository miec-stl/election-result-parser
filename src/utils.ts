export function round(value: number, decimals: number) {
	// @ts-ignore
	return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}
