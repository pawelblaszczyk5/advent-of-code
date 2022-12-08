const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_8/input.txt`);

const treeMap = fileContent.split('\n').map((row) =>
	row.split('').map((treeHeight) => Number(treeHeight))
);

const DIRECTIONS = ['top', 'left', 'right', 'bottom'] as const;
type Direction = typeof DIRECTIONS[number];

const getAllTreesInGivenDirection = (
	rowIndex: number,
	columnIndex: number,
	direction: Direction,
) => {
	if (direction === 'right' || direction === 'left') {
		const row = treeMap[rowIndex];

		if (!row) throw new Error('Incorrect data');

		if (direction === 'right') return row.slice(columnIndex + 1);

		return row.slice(0, columnIndex);
	}

	const column = treeMap.map((row) => row[columnIndex]);

	if (column.some((tree) => tree === undefined)) throw new Error('Incorrect data');

	const safeColumn = column as Array<number>;

	if (direction === 'bottom') return safeColumn.slice(rowIndex + 1);

	return safeColumn.slice(0, rowIndex);
};

const visibleTrees = treeMap.reduce(
	(sum, row, rowIndex) =>
		sum + row.reduce((sum, tree, columnIndex) => {
			const isVisibleFromAnySide = DIRECTIONS.some((direction) => {
				const allTreesInGivenDirection = getAllTreesInGivenDirection(
					rowIndex,
					columnIndex,
					direction,
				);

				return Math.max(...allTreesInGivenDirection) < tree;
			});

			return isVisibleFromAnySide ? sum + 1 : sum;
		}, 0),
	0,
);

console.log(visibleTrees);
