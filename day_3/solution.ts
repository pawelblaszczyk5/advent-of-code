const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_3/input.txt`);

const rucksacks = fileContent.split('\n').map((
	rucksacksCombined,
) =>
	[
		rucksacksCombined.slice(0, rucksacksCombined.length / 2),
		rucksacksCombined.slice(-rucksacksCombined.length / 2),
	] as const
);

const duplicatedItems = rucksacks.map(([firstRucksack, secondRucksack]) => {
	const firstRucksackWithoutDuplicates: Array<string> = Array.from(new Set(firstRucksack));
	const secondRucksackWithoutDuplicates: Array<string> = Array.from(new Set(secondRucksack));

	return firstRucksackWithoutDuplicates.filter((item) =>
		secondRucksackWithoutDuplicates.includes(item)
	);
}).flat();

const getItemPriority = (item: string) => {
	const itemCharCode = item.charCodeAt(0);

	if (itemCharCode >= 65 && itemCharCode <= 90) {
		return itemCharCode - 64 + 26;
	}

	if (itemCharCode >= 97 && itemCharCode <= 122) {
		return itemCharCode - 96;
	}

	throw new Error('Unexpected item');
};

const duplicatedItemsPrioritiesSum = duplicatedItems.reduce(
	(currentSum, currentItem) => currentSum + getItemPriority(currentItem),
	0,
);

console.log(duplicatedItemsPrioritiesSum);
