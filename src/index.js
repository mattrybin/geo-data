const path = require("path")
const csv = require("csv-parser")
const fs = require("fs")

const getDataPopulation = () => {
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(`${__dirname}/polish.gminas.csv`)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error))
  })
}

const getDataGminas = () => {
  const geoJsonFilePath = path.join(__dirname, "poland.municipalities.json")
  const geoJsonFileContent = fs.readFileSync(geoJsonFilePath, "utf8")
  return JSON.parse(geoJsonFileContent)
}

const processPopulation = (input) => {
  console.log(input[0].pop)
  const filtered = input.filter((input) => input.Gmina.includes("gmina"))
  const correctFormat = filtered.map((input) => ({
    ...input,
    Gmina: input.Gmina.replace(/\bGmina\b/gi, "").trim(),
    Population: parseInt(input.Population.replace(/,/g, "")),
    Area: parseFloat(input.Area),
    Density: parseFloat(input.Density),
    PopulationChange: parseFloat(input["Population increase, ‰"])
  }))
  return correctFormat
}

const setDataFromGminaDataset = (data, findBy) => {
  const gmina = data.find(({ Gmina }) => {
    return Gmina === findBy
  })
  console.log("GMINA", gmina)
  if (gmina?.Population) {
    return {
      population: gmina.Population,
      area: gmina.Area,
      density: gmina.Density,
      population_change: gmina.PopulationChange
    }
  } else {
    return {
      population: 0,
      area: 0,
      density: 0,
      population_change: 0
    }
  }
}

// To use this function asynchronously
const run = async () => {
  try {
    const data = processPopulation(await getDataPopulation())
    const gminas = getDataGminas()
    const features = gminas.features.map((input) => ({
      ...input,
      properties: {
        ...input.properties,
        ...setDataFromGminaDataset(data, input.properties.name)
      }
    }))
    const newGminas = { ...gminas, features: features }
    console.log(newGminas)
    const finalData = JSON.stringify(newGminas)
    fs.writeFile("generated.poland.municipalities.json", finalData, (err) => {
      if (err) throw err
      console.log("Data written to file")
    })
  } catch (error) {
    console.error("An error occurred: ", error)
  }
}

run()
