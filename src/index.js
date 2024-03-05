const fs = require('fs');

fs.readFile('/Users/mattrybin/SOFTWARE/learning/json/src/poland.municipalities.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  // console.log(JSON.parse(data))
  const output = JSON.parse(data)
  // console.log(output.features)
  const result = output.features.map((input) => {
    console.log(input.properties.name)
    return ({ ...input, properties: { ...input.properties, awesome: "GOOD" } });
  })
  // console.log(result)
})