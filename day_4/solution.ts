const fileContent = await Deno.readTextFile(`${Deno.cwd()}/day_4/input.txt`);

type Assignment = { start: number; end: number };

const pairAssignments = fileContent.split('\n').map((pairAssignment) =>
	pairAssignment.split(',').map((assignment) => {
		const [start, end] = assignment.split('-').map((assignmentId) => Number(assignmentId));

		if (!start || !end) throw new Error('Incorrect data');

		return { start, end };
	}) as [Assignment, Assignment]
);

const overlappingAssignments = pairAssignments.filter((
	[firstAssignment, secondAssignment],
) =>
	(firstAssignment.start >= secondAssignment.start &&
		firstAssignment.end <= secondAssignment.end) ||
	(secondAssignment.start >= firstAssignment.start && secondAssignment.end <= firstAssignment.end)
);

console.log(overlappingAssignments.length);
