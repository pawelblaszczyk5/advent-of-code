const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_9/input.txt`);

const DIRECTION = {
	UP: 'U',
	DOWN: 'D',
	RIGHT: 'R',
	LEFT: 'L',
} as const;

type Direction = typeof DIRECTION[keyof typeof DIRECTION];
type Position = { x: number; y: number };
type Instruction = {
	direction: Direction;
	count: number;
};

const instructions = fileContent.split('\n').map((instructionLine) => {
	const [direction, count] = instructionLine.split(' ');

	return {
		direction,
		count: Number(count),
	} as Instruction;
});

const PARTS_COUNT = 9;

const headPosition: Position = { x: 50, y: 50 };
const partsPositions: Array<Position> = Array.from(
	{ length: PARTS_COUNT },
	() => ({ x: 50, y: 50 }),
);

const tailVisitedPositions = new Set<string>(['50:50']);

const updateParts = (part: Position, nextPart: Position) => {
	const yDifference = nextPart.y - part.y;
	const xDifference = nextPart.x - part.x;

	if (
		Math.abs(yDifference) <= 1 &&
		Math.abs(xDifference) <= 1
	) return;

	if (yDifference >= 1) part.y += 1;
	if (yDifference <= -1) part.y -= 1;
	if (xDifference >= 1) part.x += 1;
	if (xDifference <= -1) part.x -= 1;
};

instructions.forEach(({ direction, count }) => {
	Array.from({ length: count }).forEach(() => {
		switch (direction) {
			case DIRECTION.DOWN: {
				headPosition.y += 1;
				break;
			}
			case DIRECTION.UP: {
				headPosition.y -= 1;
				break;
			}
			case DIRECTION.LEFT: {
				headPosition.x -= 1;
				break;
			}
			case DIRECTION.RIGHT: {
				headPosition.x += 1;
				break;
			}
		}

		partsPositions.forEach((part, index, allParts) =>
			updateParts(part, allParts[index - 1] ?? headPosition)
		);

		tailVisitedPositions.add(`${partsPositions.at(-1)!.y}:${partsPositions.at(-1)!.x}`);
	});
});

console.log(tailVisitedPositions.size);
