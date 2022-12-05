const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_5/input.txt`);

const [rawStacks, rawInstructions] = fileContent.split('\n\n') as [string, string];

const BEGIN_INDEX = 1;
const OFFSET = 4;
const STACKS_COUNT = 3;

type Stack = Array<string>;
type Stacks = [Stack, Stack, Stack];

const stacks = rawStacks.split('\n').slice(0, -1).reduce<Stacks>(
	(stacks, currentRecord) => {
		Array.from({ length: STACKS_COUNT }).forEach((_, index) => {
			const possibleElement = currentRecord[index * OFFSET + BEGIN_INDEX];

			if (possibleElement === ' ' || !possibleElement) return;

			stacks[index]?.push(possibleElement);
		});

		return stacks;
	},
	[[], [], []] as Stacks,
).map((stack) => stack.reverse());

const instructionRegEx = /move (\d+) from (\d+) to (\d+)/;
const instructions = rawInstructions.split('\n').map((instruction) => {
	const result = instruction.match(instructionRegEx);

	if (!result) throw new Error('Incorrect data');

	const [, count, source, destination] = result;

	return { count: Number(count), source: Number(source), destination: Number(destination) };
});
