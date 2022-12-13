const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_13/input.txt`);

type Signal = Array<number | Array<Signal>>;

const signalsPair = fileContent.split('\n\n').map((pair) =>
	pair.split('\n').map((value) => {
		try {
			return JSON.parse(value);
		} catch (e) {
			console.log(e);
		}
	})
) as Array<[Signal, Signal]>;

console.log(signalsPair);
