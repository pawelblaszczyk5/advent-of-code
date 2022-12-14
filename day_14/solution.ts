const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_14/input.txt`);

const instructions = fileContent.split('\n').map((line) =>
	line.split(' -> ').map((instruction) => instruction.split(',').map((coord) => Number(coord)))
) as Array<Array<[number, number]>>;
