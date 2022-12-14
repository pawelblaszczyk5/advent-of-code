const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_14/input.txt`);

const instructions = fileContent.split('\n').map((line) =>
	line.split(' -> ').map((instruction) => instruction.split(',').map((coord) => Number(coord)))
) as Array<Array<[number, number]>>;

const GRID_POINT = {
	SAND: 'o',
	ROCK: '#',
	AIR: '.',
	SAND_SOURCE: '+',
} as const;

const GRID_WIDTH = 1000;
const GRID_HEIGHT = 1000;

const grid: Array<Array<typeof GRID_POINT[keyof typeof GRID_POINT]>> = Array.from(
	{ length: GRID_HEIGHT },
	() => Array.from({ length: GRID_WIDTH }, () => GRID_POINT.AIR),
);

grid[0]![500]! = GRID_POINT.SAND_SOURCE;
