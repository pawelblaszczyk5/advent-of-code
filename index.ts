const fileContent = await Deno.readTextFile("./input.txt");

const elvesCalories = fileContent
  .split("\n\n")
  .map((elfCaloryList) =>
    elfCaloryList.split("\n").map((caloryValue) => Number(caloryValue))
  );

const elvesCaloriesSummed = elvesCalories.map((elfCalories) =>
  elfCalories.reduce((prev, curr) => prev + curr, 0)
);

const elvesCaloriesSummedSorted = [...elvesCaloriesSummed].sort((a, b) =>
  b - a
);

const maximumCaloriesCarriedBySingleElf = elvesCaloriesSummedSorted[0];

console.log(maximumCaloriesCarriedBySingleElf);

const top3ElvesWithMostCalories = elvesCaloriesSummedSorted.slice(0, 3);

const sumOfTop3ElvesCalories = top3ElvesWithMostCalories.reduce(
  (prev, curr) => prev + curr,
  0,
);

console.log(sumOfTop3ElvesCalories);
