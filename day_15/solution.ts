const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_15/input.txt`);
const instructionParsingRegex =
	/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;

const getManhattanDistance = ([startY, startX]: [number, number], [endY, endX]: [number, number]) =>
	Math.abs(startX - endX) + Math.abs(startY - endY);

const instructions = fileContent.split('\n').map((instruction) => {
	const matches = instruction.match(instructionParsingRegex);

	if (!matches) throw new Error('Incorrect data');

	const [, unparsedSensorX, unparsedSensorY, unparsedBeaconX, unparsedBeaconY] = matches;

	if (!unparsedSensorX || !unparsedSensorY || !unparsedBeaconX || !unparsedBeaconY) {
		throw new Error('Incorrect data');
	}

	const sensorX = Number(unparsedSensorX);
	const sensorY = Number(unparsedSensorY);
	const beaconX = Number(unparsedBeaconX);
	const beaconY = Number(unparsedBeaconY);
	const distanceBetween = getManhattanDistance([sensorY, sensorX], [beaconY, beaconX]);

	return {
		sensorX,
		sensorY,
		distanceBetween,
	};
});

const drawSensorsRanges = (line: number): Array<[number, number]> => {
	const ranges: Array<[number, number]> = [];

	instructions.forEach(
		({ sensorX, sensorY, distanceBetween }) => {
			if (sensorY - distanceBetween < line && sensorY + distanceBetween > line) {
				const lineLength = (distanceBetween - Math.abs(line - sensorY)) * 2 + 1;
				const halfLineLength = Math.floor(lineLength / 2);

				ranges.push([
					sensorX - halfLineLength,
					sensorX + halfLineLength,
				]);
			}
		},
	);

	return ranges.sort(([a], [z]) => a - z).reduce<Array<[number, number]>>((result, range) => {
		if (!result.length) {
			result.push(range);

			return result;
		}

		const top = result.at(-1);

		if (!top) throw new Error('Unexpected error');

		if (top[1] < range[0]) {
			result.push(range);
		} else if (top[1] < range[1]) {
			top[1] = range[1];
		}

		return result;
	}, []);
};

const MIN_Y = 0;
const MAX_Y = 4000000;

for (let index = MIN_Y; index <= MAX_Y; index += 1) {
	const rangesSorted = drawSensorsRanges(index).sort(([a], [z]) => a - z);

	const range = rangesSorted.find(([, end], index) => {
		const nextRange = rangesSorted[index + 1];

		if (!nextRange) return;

		return end + 1 < nextRange[0];
	});

	if (range) {
		console.log(
			(range[1] + 1) * 4000000 + index,
		);
	}
}
