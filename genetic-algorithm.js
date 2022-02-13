var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var GENES = [
    { id: 1, normalValue: 10, negativeValue: -3, maximumPerIndividual: 2 },
    { id: 2, normalValue: 5, negativeValue: -1, maximumPerIndividual: 3 },
    { id: 3, normalValue: 15, negativeValue: -7, maximumPerIndividual: 1 },
    { id: 4, normalValue: 3, negativeValue: -1, maximumPerIndividual: 3 },
    { id: 5, normalValue: 7, negativeValue: 0, maximumPerIndividual: 2 },
    { id: 6, normalValue: 12, negativeValue: -5, maximumPerIndividual: 2 }
];
var QUANTITY_OF_INDIVIDUALS = 6;
var QUANTITY_OF_GENES_PER_INDIVIDUAL = 5;
var QUANTITY_OF_GENERATIONS = 10;
export function generateAlgorithmResult() {
    var generations = [];
    var currentPopulation = generateRandomPopulation();
    generateIdsForEachIndividualInPopulation(currentPopulation);
    var initialGeneration = createGenerationFromPopulation(currentPopulation);
    generations.push(initialGeneration);
    for (var i = 1; i < QUANTITY_OF_GENERATIONS; i++) {
        var naturalSelectedCouples = performNaturalSelectionOnPopulation(currentPopulation);
        var newPopulation = [];
        for (var _i = 0, naturalSelectedCouples_1 = naturalSelectedCouples; _i < naturalSelectedCouples_1.length; _i++) {
            var couple = naturalSelectedCouples_1[_i];
            var _a = generateTwoChildIndividualsFromCoupleWithCrossover(couple), firstChild = _a[0], secondChild = _a[1];
            newPopulation.push(firstChild, secondChild);
        }
        generateIdsForEachIndividualInPopulation(newPopulation);
        var newGeneration = createGenerationFromPopulation(newPopulation);
        generations.push(newGeneration);
        currentPopulation = newPopulation;
    }
    return generations;
}
function generateRandomPopulation() {
    var population = [];
    for (var i = 0; i < QUANTITY_OF_INDIVIDUALS; i++) {
        population.push(generateIndividualWithRandomGenes());
    }
    return population;
}
function generateIndividualWithRandomGenes() {
    var randomGenes = [];
    for (var i = 0; i < QUANTITY_OF_GENES_PER_INDIVIDUAL; i++) {
        var randomGeneIndex = Math.floor(Math.random() * GENES.length);
        randomGenes.push(GENES[randomGeneIndex]);
    }
    return {
        id: -1,
        genes: randomGenes,
        score: calculateScoreFromIndividualGenes(randomGenes)
    };
}
function calculateScoreFromIndividualGenes(individualGenes) {
    var score = 0;
    var _loop_1 = function (gene) {
        var quantityFound = individualGenes.filter(function (g) { return g.id === gene.id; }).length;
        var geneValue = quantityFound <= gene.maximumPerIndividual ? gene.normalValue : gene.negativeValue;
        score += geneValue * quantityFound;
    };
    for (var _i = 0, GENES_1 = GENES; _i < GENES_1.length; _i++) {
        var gene = GENES_1[_i];
        _loop_1(gene);
    }
    return score;
}
function generateIdsForEachIndividualInPopulation(population) {
    population.forEach(function (individual, index) { return individual.id = index + 1; });
}
function createGenerationFromPopulation(population) {
    var totalScore = 0;
    for (var _i = 0, population_1 = population; _i < population_1.length; _i++) {
        var individual = population_1[_i];
        totalScore += individual.score;
    }
    return {
        population: population,
        averageScore: totalScore / population.length
    };
}
function performNaturalSelectionOnPopulation(population) {
    var naturalSelectedCouples = [];
    var quantityOfAlreadySelectedIndividuals = 0;
    while (quantityOfAlreadySelectedIndividuals < population.length) {
        var firstSelectedIndividual = getIndividualFromPopulationWithNaturalSelection(population);
        var secondSelectedIndividual = getIndividualFromPopulationWithNaturalSelection(population);
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
function getIndividualFromPopulationWithNaturalSelection(population) {
    var firstRandomIndividualIndex;
    var secondRandomIndividualIndex;
    do {
        firstRandomIndividualIndex = Math.floor(Math.random() * population.length);
        secondRandomIndividualIndex = Math.floor(Math.random() * population.length);
    } while (firstRandomIndividualIndex === secondRandomIndividualIndex);
    var firstIndividual = population[firstRandomIndividualIndex];
    var secondIndividual = population[secondRandomIndividualIndex];
    return firstIndividual.score >= secondIndividual.score ? firstIndividual : secondIndividual;
}
function generateTwoChildIndividualsFromCoupleWithCrossover(couple) {
    var crossoverCutIndex;
    do {
        crossoverCutIndex = Math.floor(Math.random() * (GENES.length - 1));
    } while (crossoverCutIndex === 0 || crossoverCutIndex === GENES.length - 1);
    var firstChildGenes = __spreadArray(__spreadArray([], couple.first.genes.slice(0, crossoverCutIndex), true), couple.second.genes.slice(crossoverCutIndex, undefined), true);
    var secondChildGenes = __spreadArray(__spreadArray([], couple.second.genes.slice(0, crossoverCutIndex), true), couple.first.genes.slice(crossoverCutIndex, undefined), true);
    var firstChild = {
        id: -1,
        genes: firstChildGenes,
        score: calculateScoreFromIndividualGenes(firstChildGenes)
    };
    var secondChild = {
        id: -1,
        genes: secondChildGenes,
        score: calculateScoreFromIndividualGenes(secondChildGenes)
    };
    return [firstChild, secondChild];
}
