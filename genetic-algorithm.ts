type Gene = {
  id: number;
  normalValue: number;
  negativeValue: number;
  maximumPerIndividual: number;
};

type Individual = {
  id: number;
  genes: Gene[];
  score: number;
};

type Generation = {
  population: Individual[];
  averageScore: number;
};

type Couple = {
  first: Individual;
  second: Individual;
};


const GENES: Gene[] = [
  { id: 1, normalValue: 10, negativeValue: -3, maximumPerIndividual: 2 },
  { id: 2, normalValue: 5, negativeValue: -1, maximumPerIndividual: 3 },
  { id: 3, normalValue: 15, negativeValue: -7, maximumPerIndividual: 1 },
  { id: 4, normalValue: 3, negativeValue: -1, maximumPerIndividual: 3 },
  { id: 5, normalValue: 7, negativeValue: 0, maximumPerIndividual: 2 },
  { id: 6, normalValue: 12, negativeValue: -5, maximumPerIndividual: 2 }
];
const QUANTITY_OF_INDIVIDUALS = 6;
const QUANTITY_OF_GENES_PER_INDIVIDUAL = 5;
const QUANTITY_OF_GENERATIONS = 10;


export function generateAlgorithmResult(): Generation[] {
  let generations: Generation[] = [];

  let currentPopulation = generateRandomPopulation();
  generateIdsForEachIndividualInPopulation(currentPopulation);
  
  const initialGeneration = createGenerationFromPopulation(currentPopulation);
  generations.push(initialGeneration);
  
  for (let i = 1; i < QUANTITY_OF_GENERATIONS; i++) {
    const naturalSelectedCouples = performNaturalSelectionOnPopulation(currentPopulation);
    const newPopulation: Individual[] = [];
  
    for (const couple of naturalSelectedCouples) {
      const [firstChild, secondChild] = generateTwoChildIndividualsFromCoupleWithCrossover(couple);
      newPopulation.push(firstChild, secondChild);
    }
  
    generateIdsForEachIndividualInPopulation(newPopulation);
  
    const newGeneration = createGenerationFromPopulation(newPopulation);
    generations.push(newGeneration);
  
    currentPopulation = newPopulation;
  }

  return generations;
}

function generateRandomPopulation(): Individual[] {
  const population: Individual[] = [];

  for (let i = 0; i < QUANTITY_OF_INDIVIDUALS; i++) {
    population.push(generateIndividualWithRandomGenes());
  }

  return population;
}

function generateIndividualWithRandomGenes(): Individual {
  const randomGenes: Gene[] = [];

  for (let i = 0; i < QUANTITY_OF_GENES_PER_INDIVIDUAL; i++) {
    const randomGeneIndex = Math.floor(Math.random() * GENES.length);
    randomGenes.push(GENES[randomGeneIndex]);
  }

  return {
    id: -1,
    genes: randomGenes,
    score: calculateScoreFromIndividualGenes(randomGenes)
  };
}

function calculateScoreFromIndividualGenes(individualGenes: Gene[]): number {
  let score = 0;

  for (const gene of GENES) {
    const quantityFound = individualGenes.filter(g => g.id === gene.id).length;
    const geneValue = quantityFound <= gene.maximumPerIndividual ? gene.normalValue : gene.negativeValue;
    score += geneValue * quantityFound;
  }

  return score;
}

function generateIdsForEachIndividualInPopulation(population: Individual[]): void {
  population.forEach((individual, index) => individual.id = index + 1);
}

function createGenerationFromPopulation(population: Individual[]): Generation {
  let totalScore = 0;

  for (const individual of population) {
    totalScore += individual.score;
  }

  return {
    population,
    averageScore: totalScore / population.length
  };
}

function performNaturalSelectionOnPopulation(population: Individual[]): Couple[] {
  const naturalSelectedCouples: Couple[] = [];
  let quantityOfAlreadySelectedIndividuals = 0;

  while (quantityOfAlreadySelectedIndividuals < population.length) {
    const firstSelectedIndividual = getIndividualFromPopulationWithNaturalSelection(population);
    const secondSelectedIndividual = getIndividualFromPopulationWithNaturalSelection(population);

    if (firstSelectedIndividual.id === secondSelectedIndividual.id) {
      continue;
    }

    naturalSelectedCouples.push({
      first: firstSelectedIndividual,
      second: secondSelectedIndividual
    });
    quantityOfAlreadySelectedIndividuals += 2;
  }

  return naturalSelectedCouples;
}

function getIndividualFromPopulationWithNaturalSelection(population: Individual[]): Individual {
  let firstRandomIndividualIndex: number;
  let secondRandomIndividualIndex: number;

  do {
    firstRandomIndividualIndex = Math.floor(Math.random() * population.length);
    secondRandomIndividualIndex = Math.floor(Math.random() * population.length);
  } while (firstRandomIndividualIndex === secondRandomIndividualIndex);

  const firstIndividual = population[firstRandomIndividualIndex];
  const secondIndividual = population[secondRandomIndividualIndex];

  return firstIndividual.score >= secondIndividual.score ? firstIndividual : secondIndividual;
}

function generateTwoChildIndividualsFromCoupleWithCrossover(couple: Couple): Individual[] {
  let crossoverCutIndex: number;

  do {
    crossoverCutIndex = Math.floor(Math.random() * (GENES.length - 1));
  } while (crossoverCutIndex === 0 || crossoverCutIndex === GENES.length - 1);

  const firstChildGenes = [
    ...couple.first.genes.slice(0, crossoverCutIndex),
    ...couple.second.genes.slice(crossoverCutIndex, undefined)
  ];

  const secondChildGenes = [
    ...couple.second.genes.slice(0, crossoverCutIndex),
    ...couple.first.genes.slice(crossoverCutIndex, undefined)
  ];

  const firstChild: Individual = {
    id: -1,
    genes: firstChildGenes,
    score: calculateScoreFromIndividualGenes(firstChildGenes)
  };

  const secondChild: Individual = {
    id: -1,
    genes: secondChildGenes,
    score: calculateScoreFromIndividualGenes(secondChildGenes)
  };

  return [ firstChild, secondChild ];
}
