import { readFile } from 'node:fs/promises';

const fileContent = (await readFile('./input.txt')).toString();

const elvesCalories = fileContent
	.split('\n\n')
	.map(elfCaloryList => elfCaloryList.split('\n').map(caloryValue => Number(caloryValue)));

const elvesCaloriesSummed = elvesCalories.map(elfCalories => elfCalories.reduce((prev, curr) => prev + curr, 0));

const maximumCaloriesCarriedBySingleElf = Math.max(...elvesCaloriesSummed);

console.log(maximumCaloriesCarriedBySingleElf);
