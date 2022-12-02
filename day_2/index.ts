const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_2/input.txt`);

const OPONENT_MOVE = {
	ROCK: 'A',
	PAPER: 'B',
	SCISSORS: 'C',
} as const;

type OponentMove = typeof OPONENT_MOVE[keyof typeof OPONENT_MOVE];

const MY_MOVE = {
	ROCK: 'X',
	PAPER: 'Y',
	SCISSORS: 'Z',
} as const;

type MyMove = typeof MY_MOVE[keyof typeof MY_MOVE];

const BASE_SCORE = {
	LOSE: 0,
	DRAW: 3,
	WIN: 6,
} as const;

const BONUS_SCORE = {
	[MY_MOVE.ROCK]: 1,
	[MY_MOVE.PAPER]: 2,
	[MY_MOVE.SCISSORS]: 3,
};

type StrategyGuideEntry = [OponentMove, MyMove];

const strategyGuide = fileContent
	.split('\n')
	.map((roundStrategy) => roundStrategy.split(' ')) as Array<StrategyGuideEntry>;

const getBaseScore = ([oponentMove, myMove]: StrategyGuideEntry) => {
	if (oponentMove === OPONENT_MOVE.ROCK && myMove === MY_MOVE.ROCK) return BASE_SCORE.DRAW;
	if (oponentMove === OPONENT_MOVE.ROCK && myMove === MY_MOVE.PAPER) return BASE_SCORE.WIN;
	if (oponentMove === OPONENT_MOVE.ROCK && myMove === MY_MOVE.SCISSORS) return BASE_SCORE.LOSE;

	if (oponentMove === OPONENT_MOVE.PAPER && myMove === MY_MOVE.ROCK) return BASE_SCORE.LOSE;
	if (oponentMove === OPONENT_MOVE.PAPER && myMove === MY_MOVE.PAPER) return BASE_SCORE.DRAW;
	if (oponentMove === OPONENT_MOVE.PAPER && myMove === MY_MOVE.SCISSORS) return BASE_SCORE.WIN;

	if (oponentMove === OPONENT_MOVE.SCISSORS && myMove === MY_MOVE.ROCK) return BASE_SCORE.WIN;
	if (oponentMove === OPONENT_MOVE.SCISSORS && myMove === MY_MOVE.PAPER) return BASE_SCORE.LOSE;
	if (oponentMove === OPONENT_MOVE.SCISSORS && myMove === MY_MOVE.SCISSORS) return BASE_SCORE.DRAW;

	throw new Error('All cases should be covered');
};

const getResult = ([oponentMove, myMove]: StrategyGuideEntry) => {
	return getBaseScore([oponentMove, myMove]) + BONUS_SCORE[myMove];
};

const resultByStrategyGuide = strategyGuide.reduce<number>(
	(currentScore, strategyGuideEntry) => getResult(strategyGuideEntry) + currentScore,
	0,
);

console.log(resultByStrategyGuide);
