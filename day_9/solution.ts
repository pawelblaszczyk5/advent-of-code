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

console.log(instructions);

const headPosition = { x: 0, y: 0 };
const tailPosition = { x: 0, y: 0 };
