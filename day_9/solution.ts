const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_9/input.txt`);

const DIRECTION = {
	UP: 'U',
	DOWN: 'D',
	RIGHT: 'R',
	LEFT: 'L',
} as const;

type Direction = typeof DIRECTION[keyof typeof DIRECTION];

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

const headPosition = { x: 50, y: 50 };
const tailPosition = { x: 50, y: 50 };

const tailVisitedPositions = new Set<string>(['50:50']);

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

		const yDifference = headPosition.y - tailPosition.y;
		const xDifference = headPosition.x - tailPosition.x;

		if (
			Math.abs(yDifference) <= 1 &&
			Math.abs(xDifference) <= 1
		) return;

		if (yDifference >= 1) tailPosition.y += 1;
		if (yDifference <= -1) tailPosition.y -= 1;
		if (xDifference >= 1) tailPosition.x += 1;
		if (xDifference <= -1) tailPosition.x -= 1;

		tailVisitedPositions.add(`${tailPosition.y}:${tailPosition.x}`);
	});
});

console.log(tailVisitedPositions.size);
