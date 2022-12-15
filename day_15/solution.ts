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

const Y_OFFSET = Math.abs(minHeight - maxDistance);
const X_OFFSET = Math.abs(minWidth - maxDistance);

const grid: Array<Array<typeof GRID_POINT[keyof typeof GRID_POINT]>> = Array.from({
	length: maxHeight - minHeight + 2 * maxDistance + 1,
}, () => Array.from({ length: maxWidth - minWidth + 2 * maxDistance + 1 }, () => GRID_POINT.EMPTY));

const printGrid = () => {
	console.log(grid.map((row) => row.join('')).join('\n'));
};

const drawBeaconsAndSensors = () => {
	instructions.forEach(({ sensorX, sensorY, beaconX, beaconY }) => {
		if (!grid[beaconY + Y_OFFSET]?.[beaconX + X_OFFSET]) throw new Error('Incorrect data');

		grid[beaconY + Y_OFFSET]![beaconX + X_OFFSET] = GRID_POINT.BEACON;

		if (!grid[sensorY + Y_OFFSET]?.[sensorX + X_OFFSET]) throw new Error('Incorrect data');

		grid[sensorY + Y_OFFSET]![sensorX + X_OFFSET] = GRID_POINT.SENSOR;
	});
};

drawBeaconsAndSensors();

const drawSensorsRanges = () => {
	instructions.forEach(({ sensorX, sensorY, beaconX, beaconY, distanceBetween }) => {
		console.log(distanceBetween);
	});
};

drawSensorsRanges();
