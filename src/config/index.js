const dotenv = require('dotenv')

dotenv.config({ quiet: true })

function getRequiredVariable(name) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`В файле .env не задана переменная ${name}`)
  }

  return value.trim()
}

function loadConfig() {
  const minAgeText = getRequiredVariable('MIN_AGE')
  const minAge = Number(minAgeText)

  if (Number.isNaN(minAge)) {
    throw new Error(`MIN_AGE должен быть числом, а сейчас там: "${minAgeText}"`)
  }

  return {
    inputFile: getRequiredVariable('INPUT_FILE'),
    outputFile: getRequiredVariable('OUTPUT_FILE'),
    minAge: minAge,
    cityFilter: getRequiredVariable('CITY_FILTER')
  }
}

module.exports = { loadConfig }
