const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_12/input.txt`);

const parsedMountain = fileContent.split('\n').map((line) => line.split(''));

const PLACE = {
	START: 'S',
	END: 'E',
} as const;

const PLACE_HEIGHT = {
	[PLACE.START]: 'a'.charCodeAt(0),
	[PLACE.END]: 'z'.charCodeAt(0),
} as const;

type Place = typeof PLACE[keyof typeof PLACE];

const findPlace = (place: Place): [number, number] => {
	const row = parsedMountain.find((row) => row.includes(place));

	if (!row) throw new Error('Can\'t find given place');

	const y = parsedMountain.indexOf(row);
	const x = row.indexOf(place);

	return [y, x];
};

const getEstimatedDistance = ([startY, startX]: [number, number], [endY, endX]: [number, number]) =>
	Math.abs(startX - endX) + Math.abs(startY - endY);

const getSuccessors = (
	[y, x]: [number, number],
) =>
	[
		parsedMountain[y - 1]?.[x] ? [y - 1, x] as const : null,
		parsedMountain[y + 1]?.[x] ? [y + 1, x] as const : null,
		parsedMountain[y]?.[x - 1] ? [y, x - 1] as const : null,
		parsedMountain[y]?.[x + 1] ? [y, x + 1] as const : null,
	].filter((value) => {
		if (value === null) return;

		const [newY, newX] = value;

		const successor = parsedMountain[newY]?.[newX];
		const parent = parsedMountain[y]?.[x];

		if (!successor || !parent) return;

		const successorHeight = PLACE_HEIGHT[successor] ?? successor.charCodeAt(0);
		const parentHeight = PLACE_HEIGHT[parent] ?? parent.charCodeAt(0);

		return parentHeight - successorHeight >= -1;
	}) as Array<[number, number]>;

const startCoords = findPlace(PLACE.START);
const endCoords = findPlace(PLACE.END);

type Node = {
	x: number;
	y: number;
	parent?: Node;
	distanceFromStart: number;
	estimatedDistanceToEnd: number;
	estimatedValue: number;
};

const findBestPath = (startCoords: [number, number], endCoords: [number, number]) => {
	const openList: Array<Node> = [];
	const closedList: Array<Node> = [];

	const estimatedDistanceToEnd = getEstimatedDistance(startCoords, endCoords);
	const startingNode: Node = {
		y: startCoords[0],
		x: startCoords[1],
		distanceFromStart: 0,
		estimatedDistanceToEnd: estimatedDistanceToEnd,
		estimatedValue: estimatedDistanceToEnd,
	};

	openList.push(startingNode);

	let finishingNode: Node | undefined = undefined;

	while (openList.length) {
		const bestNode = openList.reduce(
			(prevBestNode, currentNode) =>
				prevBestNode.estimatedValue > currentNode.estimatedValue ? currentNode : prevBestNode,
			openList[0]!,
		);

		openList.splice(openList.indexOf(bestNode), 1);
		const successors = getSuccessors([bestNode.y, bestNode.x]);

		const successorsNodes = successors.map<Node>((coords) => {
			const estimatedDistanceToEnd = getEstimatedDistance(coords, endCoords);
			const distanceFromStart = bestNode.distanceFromStart + 1;

			return {
				y: coords[0],
				x: coords[1],
				distanceFromStart,
				estimatedDistanceToEnd,
				estimatedValue: estimatedDistanceToEnd + distanceFromStart,
				parent: bestNode,
			};
		});

		const endNode = successorsNodes.find((node) =>
			node.y === endCoords[0] && node.x === endCoords[1]
		);

		if (endNode) {
			finishingNode = endNode;
			break;
		}

		successorsNodes.forEach((successorNode) => {
			const nodeFromOpenList = openList.find((node) =>
				node.x === successorNode.x && node.y === successorNode.y
			);

			if (nodeFromOpenList && nodeFromOpenList.estimatedValue <= successorNode.estimatedValue) {
				return;
			}

			const nodeFromClosedList = closedList.find((node) =>
				node.x === successorNode.x && node.y === successorNode.y
			);

			if (nodeFromClosedList && nodeFromClosedList.estimatedValue <= successorNode.estimatedValue) {
				return;
			}

			openList.push(successorNode);
		});

		closedList.push(bestNode);
	}

	let nodeOnPath: Node | undefined = finishingNode;
	const path = [];

	while (nodeOnPath?.parent) {
		path.push(nodeOnPath.parent);
		nodeOnPath = nodeOnPath.parent;
	}

	return path.length;
};

console.log(findBestPath(startCoords, endCoords));

// Part 2

const allPossibleStartingPositions = parsedMountain.reduce<Array<[number, number]>>(
	(coords, row, rowIndex) => {
		coords.push(...row.reduce<Array<[number, number]>>((coords, char, columnIndex) => {
			if (char === 'a') coords.push([rowIndex, columnIndex]);

			return coords;
		}, []));

		return coords;
	},
	[],
);

const shortestSolutionFromLowestPoint =
	allPossibleStartingPositions.map((startCoords) => findBestPath(startCoords, endCoords)).filter(
		(path) => path !== 0,
	).sort((
		a,
		b,
	) => a - b)[0];

console.log(shortestSolutionFromLowestPoint);
