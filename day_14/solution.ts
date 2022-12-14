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
const GRID_HEIGHT = maxHeight + 5;

const grid: Array<Array<typeof GRID_POINT[keyof typeof GRID_POINT]>> = Array.from(
	{ length: GRID_HEIGHT },
	() => Array.from({ length: GRID_WIDTH }, () => GRID_POINT.AIR),
);

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

console.log(grid.map((row) => row.slice(minWidth - 5, maxWidth + 5).join('')).join('\n'));
