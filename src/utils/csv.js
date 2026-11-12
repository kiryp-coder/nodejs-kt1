const fs = require('fs')
const readline = require('readline')

function splitCsvLine(line) {
  return line.split(',').map((value) => value.trim())
}

function lineToObject(columnNames, line) {
  const values = splitCsvLine(line)
  const row = {}

  for (let i = 0; i < columnNames.length; i++) {
    row[columnNames[i]] = values[i]
  }

  return row
}

function waitForWriteToFinish(writeStream) {
  return new Promise((resolve, reject) => {
    writeStream.on('finish', resolve)
    writeStream.on('error', reject)
  })
}

async function filterCsvFile(inputPath, outputPath, shouldKeepRow) {
  const readStream = fs.createReadStream(inputPath, { encoding: 'utf8' })
  const writeStream = fs.createWriteStream(outputPath, { encoding: 'utf8' })
  const lines = readline.createInterface({ input: readStream, crlfDelay: Infinity })

  let columnNames = null
  let totalRows = 0
  let matchedRows = 0

  for await (const line of lines) {
    if (line.trim() === '') {
      continue
    }

    if (columnNames === null) {
      columnNames = splitCsvLine(line)
      writeStream.write(line + '\n')
      continue
    }

    totalRows++
    const row = lineToObject(columnNames, line)

    if (shouldKeepRow(row)) {
      matchedRows++
      writeStream.write(line + '\n')
    }
  }

  writeStream.end()
  await waitForWriteToFinish(writeStream)

  return { totalRows, matchedRows }
}

module.exports = { filterCsvFile }
