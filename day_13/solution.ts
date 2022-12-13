const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_13/input.txt`);

type Signal = number | Array<Signal>;
type Signals = Array<Signal>;

const signalsPair = fileContent.split('\n\n').map((pair) =>
	pair.split('\n').map((value) => {
		try {
			return JSON.parse(value);
		} catch (e) {
			console.log(e);
		}
	})
) as Array<[Signals, Signals]>;

const isSignal = (value: Signal | undefined): value is Signal =>
	Array.isArray(value) || typeof value === 'number';

const compareSignals = (first: Signal, second: Signal): -1 | 0 | 1 => {
	if (Array.isArray(first) || Array.isArray(second)) {
		const firstSignalAdjusted = Array.isArray(first) ? first : [first];
		const secondSignalAdjusted = Array.isArray(second) ? second : [second];

		for (
			let index = 0;
			index < Math.max(firstSignalAdjusted.length, secondSignalAdjusted.length);
			index += 1
		) {
			const firstSignal = firstSignalAdjusted[index];
			const secondSignal = secondSignalAdjusted[index];

			if (!isSignal(firstSignal)) return 1;
			if (!isSignal(secondSignal)) return -1;

			const comparisonResult = compareSignals(firstSignal, secondSignal);

			if (comparisonResult !== 0) return comparisonResult;
		}

		return 0;
	}

	return first < second ? 1 : first === second ? 0 : -1;
};

const sumOfPassingIndexes = signalsPair.reduce<number>(
	(sum, pair, index) => compareSignals(...pair) === 1 ? sum + index + 1 : sum,
	0,
);

console.log(sumOfPassingIndexes);
