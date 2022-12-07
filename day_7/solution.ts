const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_7/input.txt`);

type BaseNode = {
	name: string;
	parent: DirectoryNode | undefined;
};

type DirectoryNode = BaseNode & {
	type: 'directory';
	children: Array<Node>;
};

type FileNode = BaseNode & {
	type: 'file';
	size: number;
};

type Node = FileNode | DirectoryNode;

const findOrCreateDirectoryNode = (name: string, tree: Array<Node>): DirectoryNode => {
	const directory = currentDirectory?.children.find((node) =>
		node.name === name && node.type === 'directory'
	) as DirectoryNode | undefined;

	if (directory) return directory;

	const newDirectory: DirectoryNode = {
		name,
		type: 'directory',
		children: [],
		parent: currentDirectory,
	};

	newDirectory.parent ? newDirectory.parent.children.push(newDirectory) : tree.push(newDirectory);

	return newDirectory;
};

const findOrCreateFileNode = (name: string, size: number, tree: Array<Node>): FileNode => {
	const file = currentDirectory?.children.find((node) =>
		node.name === name && node.type === 'file'
	) as FileNode | undefined;

	if (file) return file;

	const newFile: FileNode = {
		name,
		type: 'file',
		parent: currentDirectory,
		size,
	};

	newFile.parent ? newFile.parent.children.push(newFile) : tree.push(newFile);

	return newFile;
};

let currentDirectory: DirectoryNode | undefined;

const fileTree = fileContent.split('\n').reduce<Array<Node>>((tree, instruction) => {
	if (instruction.startsWith('$')) {
		const [, command, argument] = instruction.split(' ');

		if (command === 'cd') {
			if (!argument) throw new Error('Incorrect data');

			if (argument === '..') {
				currentDirectory = currentDirectory?.parent;

				return tree;
			}

			currentDirectory = findOrCreateDirectoryNode(argument, tree);

			return tree;
		}

		if (command === 'ls') {
			// noop
			return tree;
		}

		throw new Error('Incorrect data');
	}

	if (instruction.startsWith('dir')) {
		const [, name] = instruction.split(' ');

		if (!name) throw new Error('Incorrect data');

		findOrCreateDirectoryNode(name, tree);

		return tree;
	}

	const [size, name] = instruction.split(' ');
	const numericSize = Number(size);

	if (!name || Number.isNaN(numericSize)) throw new Error('Incorrect data');

	findOrCreateFileNode(name, numericSize, tree);

	return tree;
}, []);

const rootDirectory = fileTree[0];

if (rootDirectory?.type !== 'directory') throw new Error('Incorrect data');

const getDirectorySize = (node: DirectoryNode): number =>
	node.children.reduce((result, newNode) => {
		if (newNode.type === 'file') return result + newNode.size;

		return result + getDirectorySize(newNode);
	}, 0);

const findAllDirectoriesInside = (node: DirectoryNode): Array<DirectoryNode> => [
	...node.children.reduce((allDirectories, currentNode) => {
		if (currentNode.type === 'file') return allDirectories;

		allDirectories.add(currentNode);

		currentNode.children.forEach((node) => {
			if (node.type === 'file') return;

			allDirectories.add(node);

			findAllDirectoriesInside(node).forEach((node) => allDirectories.add(node));
		});

		return allDirectories;
	}, new Set<DirectoryNode>()),
];

const allDirectories = [rootDirectory, ...findAllDirectoriesInside(rootDirectory)];

const allDirectoriesWithSizes = allDirectories.map(
	(directory) => [directory, getDirectorySize(directory)] as const,
);

const SMALL_DIRECTORY_THRESHOLD = 100000;

const smallDirectoriesSizeSum = allDirectoriesWithSizes.filter(([, size]) =>
	size <= SMALL_DIRECTORY_THRESHOLD
).reduce((result, [, size]) => result + size, 0);

console.log(smallDirectoriesSizeSum);
