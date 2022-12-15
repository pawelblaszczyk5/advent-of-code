const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_15/input.txt`);
const instructionParsingRegex =
	/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;

let minHeight = Infinity;
let maxHeight = -Infinity;
let minWidth = Infinity;
let maxWidth = -Infinity;
let maxDistance = -Infinity;

const GRID_POINT = {
	BEACON: 'B',
	SENSOR: 'S',
	SENSOR_RANGE: '#',
	EMPTY: '.',
} as const;

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

	minHeight = Math.min(sensorY, beaconY, minHeight);
	maxHeight = Math.max(sensorY, beaconY, maxHeight);
	minWidth = Math.min(sensorX, beaconX, minWidth);
	maxWidth = Math.max(sensorX, beaconX, maxWidth);
	maxDistance = Math.max(maxDistance, distanceBetween);

	return {
		sensorX,
		sensorY,
		beaconY,
		beaconX,
		distanceBetween,
	};
});

const X_OFFSET = maxWidth - minWidth - maxDistance;
const INTERESTING_LINE = 2000000;

const row: Array<typeof GRID_POINT[keyof typeof GRID_POINT]> = Array.from({
	length: maxWidth - minWidth + 2 * maxDistance + 1,
}, () => GRID_POINT.EMPTY);

const drawLine = (
	[firstX, secondX]: readonly [number, number],
) => {
	for (let index = Math.min(firstX, secondX); index <= Math.max(firstX, secondX); index++) {
		if (row[index] === GRID_POINT.EMPTY) {
			row[index] = GRID_POINT.SENSOR_RANGE;
		}
	}
	return;
};

const drawBeaconsAndSensors = (line: number) => {
	instructions.forEach(({ sensorX, sensorY, beaconX, beaconY }) => {
		if (beaconY === line) {
			row[beaconX + X_OFFSET] = GRID_POINT.BEACON;
		}

		if (sensorY === line) {
			row[sensorX + X_OFFSET] = GRID_POINT.SENSOR;
		}
	});
};

drawBeaconsAndSensors(INTERESTING_LINE);

const drawSensorsRanges = (line: number) => {
	instructions.forEach(
		({ sensorX, sensorY, distanceBetween }) => {
			for (let index = -distanceBetween; index <= distanceBetween; index++) {
				const lineLength = (distanceBetween - Math.abs(index)) * 2 + 1;
				const halfLineLength = Math.floor(lineLength / 2);

				if (sensorY + index !== line) continue;

				console.log(sensorY + index, line);
				drawLine([sensorX + X_OFFSET - halfLineLength, sensorX + X_OFFSET + halfLineLength]);
			}
		},
	);
};

drawSensorsRanges(INTERESTING_LINE);

const findBlockedPositionsForGivenY = () => {
	return row.filter((point) => point === GRID_POINT.SENSOR_RANGE).length;
};

console.log(findBlockedPositionsForGivenY());
