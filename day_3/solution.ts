const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_3/input.txt`);

const allRuckascks = fileContent.split('\n');

const rucksacksCompartments = allRuckascks.map((
	rucksack,
) =>
	[
		rucksack.slice(0, rucksack.length / 2),
		rucksack.slice(-rucksack.length / 2),
	] as const
);

const duplicatedItems = rucksacksCompartments.map(([firstCompartment, secondCompartment]) => {
	const firstCompartmentWithoutDuplicates: Array<string> = Array.from(new Set(firstCompartment));
	const secondCompartmentWithoutDuplicates: Array<string> = Array.from(new Set(secondCompartment));

	return firstCompartmentWithoutDuplicates.filter((item) =>
		secondCompartmentWithoutDuplicates.includes(item)
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
	(currentSum, item) => currentSum + getItemPriority(item),
	0,
);

console.log(duplicatedItemsPrioritiesSum);

// Part two

const rucksacksDividedIntoGroups = Array.from(
	{ length: allRuckascks.length / 3 },
	(_, index) => allRuckascks.slice(index * 3, index * 3 + 3) as [string, string, string],
);

const UNEXPECTED_MISSING_GROUP_BADGE = '&';

const groupsBadges = rucksacksDividedIntoGroups.map(([firstElv, secondElv, thirdElv]) =>
	Array.from(firstElv).find((item) => secondElv.includes(item) && thirdElv.includes(item)) ??
		UNEXPECTED_MISSING_GROUP_BADGE
);

const groupsBadgesPrioritiesSum = groupsBadges.reduce(
	(currentSum, item) => currentSum + getItemPriority(item),
	0,
);

console.log(groupsBadgesPrioritiesSum);
