const fs = require('fs/promises')
const { loadConfig } = require('./config')
const { filterCsvFile } = require('./utils/csv')

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function main() {
  const config = loadConfig()

  if (!(await fileExists(config.inputFile))) {
    throw new Error(`Входной файл не найден: ${config.inputFile}`)
  }

  console.log(`Читаем файл: ${config.inputFile}`)
  console.log(`Условие: возраст от ${config.minAge} и город ${config.cityFilter}`)

  function shouldKeepUser(user) {
    const isOldEnough = Number(user.age) >= config.minAge
    const isFromCity = user.city === config.cityFilter
    return isOldEnough && isFromCity
  }

  const stats = await filterCsvFile(config.inputFile, config.outputFile, shouldKeepUser)

  console.log('')
  console.log('Готово!')
  console.log(`Обработано строк: ${stats.totalRows}`)
  console.log(`Прошли фильтр:   ${stats.matchedRows}`)
  console.log(`Результат сохранён в: ${config.outputFile}`)
}

main().catch((error) => {
  console.error(`Ошибка: ${error.message}`)
  process.exit(1)
})
