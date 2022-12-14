const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_14/input.txt`);

let maxHeight = 0;
let minWidth = Infinity;
let maxWidth = -Infinity;

const instructions = fileContent.split('\n').map((line) =>
	line.split(' -> ').map((instruction) => {
		const [x, y] = instruction.split(',');

		const numberCoords = [Number(y), Number(x)] as const;

		if (numberCoords[0] > maxHeight) {
			maxHeight = numberCoords[0];
		}

		if (numberCoords[1] < minWidth) {
			minWidth = numberCoords[1];
		}

		if (numberCoords[1] > maxWidth) {
			maxWidth = numberCoords[1];
		}

		return numberCoords;
	})
);

console.log(minWidth, maxWidth);

const GRID_POINT = {
	SAND: 'o',
	ROCK: '#',
	AIR: '.',
	SAND_SOURCE: '+',
} as const;

const GRID_WIDTH = 1000;
const GRID_HEIGHT = maxHeight + 4;

const grid: Array<Array<typeof GRID_POINT[keyof typeof GRID_POINT]>> = Array.from(
	{ length: GRID_HEIGHT },
	() => Array.from({ length: GRID_WIDTH }, () => GRID_POINT.AIR),
);

grid[GRID_HEIGHT - 2] = grid[GRID_HEIGHT - 2]!.map(() => GRID_POINT.ROCK);

grid[0]![500]! = GRID_POINT.SAND_SOURCE;

const drawLine = (
	[firstY, firstX]: readonly [number, number],
	[secondY, secondX]: readonly [number, number],
) => {
	if (firstX !== secondX) {
		for (let index = Math.min(firstX, secondX); index <= Math.max(firstX, secondX); index++) {
			grid[firstY]![index] = GRID_POINT.ROCK;
		}
		return;
	}

	for (let index = Math.min(firstY, secondY); index <= Math.max(firstY, secondY); index++) {
		grid[index]![firstX] = GRID_POINT.ROCK;
	}
};

const drawRocks = () => {
	instructions.forEach((instructionLine) => {
		for (let index = 0; index < instructionLine.length - 1; index++) {
			const firstInstruction = instructionLine[index];
			const secondInstruction = instructionLine[index + 1];

			if (!firstInstruction || !secondInstruction) throw new Error('Incorrect data');

			drawLine(firstInstruction, secondInstruction);
		}
	});
};

drawRocks();

const simulateSand = () => {
	let result = 0;
	let sandParticles = 0;

	const cleanPreviousSand = ([y, x]: [number, number]) => {
		if (grid[y]![x] === GRID_POINT.SAND) {
			grid[y]![x] = GRID_POINT.AIR;
		}
	};

	while (!result) {
		const sandCoordinates: [number, number] = [0, 500];

		sandParticles += 1;
		console.log(grid.map((row) => row.slice(minWidth - 5, maxWidth + 5).join('')).join('\n'));

		while (true) {
			const [y, x] = sandCoordinates;

			if (grid[y + 1]?.[x] === GRID_POINT.AIR) {
				grid[y + 1]![x] = GRID_POINT.SAND;

				cleanPreviousSand([y, x]);

				sandCoordinates[0] = y + 1;
			} else if (grid[y + 1]?.[x - 1] === GRID_POINT.AIR) {
				grid[y + 1]![x - 1] = GRID_POINT.SAND;

				cleanPreviousSand([y, x]);

				sandCoordinates[0] = y + 1;
				sandCoordinates[1] = x - 1;
			} else if (grid[y + 1]?.[x + 1] === GRID_POINT.AIR) {
				grid[y + 1]![x + 1] = GRID_POINT.SAND;

				cleanPreviousSand([y, x]);

				sandCoordinates[0] = y + 1;
				sandCoordinates[1] = x + 1;
			} else {
				if (
					grid[1]?.[500] === GRID_POINT.SAND && grid[1]?.[499] === GRID_POINT.SAND &&
					grid[1]?.[501] === GRID_POINT.SAND && grid[2]?.[501] === GRID_POINT.SAND
				) {
					result = sandParticles;
				}
				break;
			}
		}
	}

	return result + 1;
};

const maxSandParticles = simulateSand();

console.log(maxSandParticles);
