const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_5/input.txt`);

const [rawStacks, rawInstructions] = fileContent.split('\n\n') as [string, string];

const BEGIN_INDEX = 1;
const OFFSET = 4;
const STACKS_COUNT = 9;

const stacks = rawStacks.split('\n').slice(0, -1).reduce<Array<Array<string>>>(
	(stacks, currentRecord) => {
		Array.from({ length: STACKS_COUNT }).forEach((_, index) => {
			const possibleElement = currentRecord[index * OFFSET + BEGIN_INDEX];

			if (possibleElement === ' ' || !possibleElement) return;

			stacks[index] ??= [];

			stacks[index]!.push(possibleElement);
		});

		return stacks;
	},
	[],
).map((stack) => stack.reverse());

console.log(stacks);

const instructionRegEx = /move (\d+) from (\d+) to (\d+)/;
const instructions = rawInstructions.split('\n').map((instruction) => {
	const result = instruction.match(instructionRegEx);

	if (!result) throw new Error('Incorrect data');

	const [, count, source, destination] = result;

	return { count: Number(count), source: Number(source) - 1, destination: Number(destination) - 1 };
});

instructions.forEach(({ source, destination, count }) => {
	const sourceStack = stacks[source];
	const destinationStack = stacks[destination];

	if (!destinationStack || !sourceStack) throw new Error('Incorrect data');

	Array.from({ length: count }).forEach(() => destinationStack.push(sourceStack.pop()!));
});

const message = stacks.map((stack) => stack.at(-1)).join('');

console.log(message);
