const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_12/input.txt`);

const parsedMountain = fileContent.split('\n').map((line) => line.split(''));

const PLACE = {
	START: 'S',
	END: 'E',
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
		parsedMountain[y - 1]?.[x] ? [y - 1, x] : null,
		parsedMountain[y + 1]?.[x] ? [y + 1, x] : null,
		parsedMountain[y]?.[x - 1] ? [y, x - 1] : null,
		parsedMountain[y]?.[x + 1] ? [y, x + 1] : null,
	].filter((value) => value !== null) as Array<[number, number]>;

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

const openList: Array<Node> = [];
const closedList: Array<Node> = [];

const findBestPath = () => {
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

			if (nodeFromOpenList && nodeFromOpenList.estimatedValue < successorNode.estimatedValue) {
				return;
			}

			const nodeFromClosedList = closedList.find((node) =>
				node.x === successorNode.x && node.y === successorNode.y
			);

			if (nodeFromClosedList && nodeFromClosedList.estimatedValue < successorNode.estimatedValue) {
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

	console.log(path.length);
};

findBestPath();
