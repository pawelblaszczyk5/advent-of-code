const dataStreamBuffer = await Deno.readTextFile(`${Deno.cwd()}/day_6/input.txt`);

const MARKER_LENGTH = 14;

const markerEndPosition =
	Array.from(dataStreamBuffer).findIndex((_, index) =>
		new Set(dataStreamBuffer.slice(index, index + MARKER_LENGTH)).size === MARKER_LENGTH
	) + MARKER_LENGTH;

console.log(markerEndPosition);
