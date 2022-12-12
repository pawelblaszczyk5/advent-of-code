const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_12/input.txt`);

const parsedMountain = fileContent.split('\n').map((line) => line.split(''));

const PLACE = {
	START: 'S',
	END: 'E',
} as const;

type Place = typeof PLACE[keyof typeof PLACE];

const findPlace = (place: Place) => {
	const row = parsedMountain.find((row) => row.includes(place));

	if (!row) throw new Error('Can\'t find given place');

	const y = parsedMountain.indexOf(row);
	const x = row.indexOf(place);

	return [y, x] as const;
};

const startCoordinates = findPlace(PLACE.START);
const endCoordinates = findPlace(PLACE.END);

console.log(startCoordinates, endCoordinates);
