const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_11/input.txt`);

const OPERATION_TYPE = {
	ADD: '+',
	MULTIPLY: '*',
} as const;

const PARAMETER = {
	OLD: 'old',
} as const;

type OperationType = typeof OPERATION_TYPE[keyof typeof OPERATION_TYPE];
type Parameter = typeof PARAMETER[keyof typeof PARAMETER] | number;

type Monkey = {
	items: Array<number>;
	operation: {
		type: OperationType;
		parameters: [Parameter, Parameter];
	};
	test: {
		divisbleBy: number;
		throwDestinations: {
			ifTrue: number;
			ifFalse: number;
		};
	};
	itemsInspected: number;
};

const isOperationType = (value: unknown): value is OperationType =>
	typeof value === 'string' && Object.values(OPERATION_TYPE).includes(value as any);

const isStaticParameter = (value: unknown): value is Exclude<Parameter, number> =>
	typeof value === 'string' && Object.values(PARAMETER).includes(value as any);

const parseStartingItems = (startingItems: string): Monkey['items'] =>
	startingItems.slice(15).split(', ').map((item) => Number(item));

const parseOperation = (operation: string): Monkey['operation'] => {
	const [firstParameter, operationType, secondParameter] = operation.slice(17).split(
		' ',
	);

	if (!firstParameter || !operationType || !secondParameter) throw new Error('Incorrect data');

	if (!isOperationType(operationType)) {
		throw new Error('Incorrect data');
	}

	return {
		type: operationType,
		parameters: [firstParameter, secondParameter].map((parameter) =>
			isStaticParameter(parameter) ? parameter : Number(parameter)
		) as Monkey['operation']['parameters'],
	};
};

const parseTest = (test: string, testIfTrue: string, testIfFalse: string): Monkey['test'] => ({
	divisbleBy: Number(test.slice(18)),
	throwDestinations: {
		ifFalse: Number(testIfFalse.slice(26)),
		ifTrue: Number(testIfTrue.slice(25)),
	},
});

const monkeys = fileContent.split('\n\n').map<Monkey>((monkeyDescription) => {
	const [, startingItems, operation, test, testIfTrue, testIfFalse] = monkeyDescription.split('\n')
		.map((line) => line.trim());

	if (!startingItems || !operation || !test || !testIfTrue || !testIfFalse) {
		throw new Error('Incorrect data');
	}

	return {
		items: parseStartingItems(startingItems),
		operation: parseOperation(operation),
		test: parseTest(test, testIfTrue, testIfFalse),
		itemsInspected: 0,
	};
});

const denominator = monkeys.reduce(
	(denominator, monkey) => denominator * monkey.test.divisbleBy,
	1,
);

const calculateNewItemWorryLevel = (item: number, operation: Monkey['operation']) => {
	const [firstParameter, secondParameter] = operation.parameters.map((parameter) =>
		parameter === PARAMETER.OLD ? item : parameter
	) as [number, number];

	if (operation.type === OPERATION_TYPE.ADD) return firstParameter + secondParameter;
	if (operation.type === OPERATION_TYPE.MULTIPLY) return firstParameter * secondParameter;

	throw new Error('Unsupported operation');
};

const playRound = () => {
	monkeys.forEach((monkey) => {
		const { items, operation, test } = monkey;

		items.forEach((item) => {
			const newItemWorryLevel = calculateNewItemWorryLevel(item, operation);
			const hasPassedTest = newItemWorryLevel % test.divisbleBy === 0;
			const monkeyThrowDestination =
				monkeys[hasPassedTest ? test.throwDestinations.ifTrue : test.throwDestinations.ifFalse];

			monkey.itemsInspected += 1;

			if (!monkeyThrowDestination) throw new Error('Can\'t find monkey to throw item');

			monkeyThrowDestination.items.push(newItemWorryLevel % denominator);
		});

		monkey.items = [];
	});
};

Array.from({ length: 10000 }).forEach(() => playRound());

const monkeyBuisnessLevel = monkeys.map(({ itemsInspected }) => itemsInspected).sort((a, b) =>
	b - a
).slice(0, 2).reduce((currentLevel, value) => currentLevel * value, 1);

console.log(monkeys);
console.log(monkeyBuisnessLevel);
