import Papa from 'papaparse'

export default async function getCsvColumns(file: File): Promise<string[]> {
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,

      step: function (row, p) {
        p.abort()

        const columns = Object.keys(row.data?.[0] ?? row.data)

        resolve(columns)
      },
    })
  })
}
