const fs = require('fs')
const path = require('path')

// Path to the input and output JSON files
const inputFilePath = path.resolve(__dirname, 'GSPC_daily.json')
const outputFilePath = path.resolve(__dirname, 'sorted_GSPC_daily.json')

// Function to sort the data array by date in ascending order
function sortByDate(a, b) {
  return new Date(a.date) - new Date(b.date)
}

async function main() {
  try {
    // Read the input JSON file
    const data = await fs.promises.readFile(inputFilePath, 'utf-8')
    const jsonData = JSON.parse(data)

    // Sort the data array
    jsonData.sort(sortByDate)

    const mapData = jsonData.map((v) => ({
      ...v,
      ticker_name: 'S&P 500 Index',
      exchange_code: 'XNAS，XNYS',
      type: 'daily',
    }))

    // Write the sorted data to the output JSON file
    await fs.promises.writeFile(
      outputFilePath,
      JSON.stringify(mapData, null, 2),
    )

    console.log('Sorted NASDAQ data saved to', outputFilePath)
  } catch (error) {
    console.error('Error sorting NASDAQ data:', error)
  }
}

main()
