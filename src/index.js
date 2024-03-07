// const fs = require('fs');
// let geodata = {}
// const getData = async () => {
//   let geodata = {}
//   const data = await fs.readFileSync('/home/nikita/CODE/geo-data/src/poland.municipalities.json', 'utf8')
//   const populationData = await fs.readFileSync('/home/nikita/CODE/geo-data/src/poland.municipalities.json', 'utf8')
  
//   const output = JSON.parse(data)
//   // console.log(output.features)
//   const result = output.features.map((input) => {
//     // console.log(input.properties.name)
//     return ({ ...input, properties: { ...input.properties, awesome: "GOOD" } });
//   })

//   console.log(result)
// }

// console.log(getData())

const fs = require('fs');

// Read the content of the population file
const populationFilePath = '/home/nikita/CODE/geo-data/src/polish.gminas.json';
const populationFileContent = fs.readFileSync(populationFilePath, 'utf8');

// Split the population file content into an array of array strings
const populationDatabase = populationFileContent.split('\n');

// Read the content of the GeoJSON file
const geoJsonFilePath = '/home/nikita/CODE/geo-data/src/poland.municipalities.json';
const geoJsonFileContent = fs.readFileSync(geoJsonFilePath, 'utf8');

// Parse the GeoJSON data
const geoJsonData = JSON.parse(geoJsonFileContent);

// Define a regular expression pattern to match the gmina name
const gminaPattern = /\[\[([^|\]]+)\]\]/;

// Create an object to store the mapping of gmina names to population numbers
const populationGminaMap = {};

// Iterate through each entry in the population database
populationDatabase.forEach((arrayString) => {
    const match = arrayString.match(gminaPattern);

    if (match) {
        const gminaName = match[1];

        // Find the corresponding gmina data in GeoJSON using the name property
        const gminaData = geoJsonData.features.find((feature) => feature.properties.name === gminaName);

        if (gminaData) {
            const populationNumber = arrayString.match(/\|\|([\d,]+)\|\|/);
            populationGminaMap[gminaName] = {
                population: populationNumber ? parseInt(populationNumber[1].replace(/,/g, ''), 10) : 0,
                terc: gminaData.properties.terc
            };
        } else {
            console.log(`Gmina data not found for: ${gminaName}`);
        }
    }
});

// Print the mapping of gmina names to population numbers as a JSON object
console.log(JSON.stringify(populationGminaMap, null, 2));
const outputJsonFilePath = '/home/nikita/CODE/geo-data/src/populationMapping.json';

// Write the mapping of gmina names to population numbers to the JSON file
fs.writeFileSync(outputJsonFilePath, JSON.stringify(populationGminaMap, null, 2));

console.log(`JSON file created at: ${outputJsonFilePath}`);

