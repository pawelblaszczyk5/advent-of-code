const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_10/input.txt`);

const COMMAND = {
	ADDX: 'addx',
	NOOP: 'noop',
} as const;

type Command = typeof COMMAND[keyof typeof COMMAND];

const COMMAND_CYCLE_LENGTH: Record<Command, number> = {
	[COMMAND.ADDX]: 2,
	[COMMAND.NOOP]: 1,
};

const instructions = fileContent.split('\n');

let xRegister = 1;
let cycleCounts = 0;

const signalStrength: Array<number> = [];

const isCommand = (value: unknown): value is Command => {
	return typeof value === 'string' && Object.values(COMMAND).includes(value as any);
};

const checkSignalStrength = () => {
	if ((cycleCounts + 20) % 40 !== 0) return;

	signalStrength.push(cycleCounts * xRegister);
};

const startCommand = (command: Command) =>
	Array.from({ length: COMMAND_CYCLE_LENGTH[command] }).forEach(() => {
		cycleCounts += 1;
		checkSignalStrength();
	});

instructions.forEach((instruction) => {
	const [command, parameter] = instruction.split(' ');

	if (!isCommand(command)) throw new Error('Incorrect data');

	startCommand(command);

	if (command === COMMAND.ADDX) {
		xRegister += Number(parameter);
	}
});

const signalStrengthSum = signalStrength.reduce((sum, current) => sum + current, 0);

console.log(signalStrengthSum);
