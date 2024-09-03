import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"
import sortBy from "lodash/sortBy.js"

import { saveToDisk } from "../utils.js"

const csvFilePath = path.resolve("scripts/2024/data/district-breakdown.csv")
const csvData = fs.readFileSync(csvFilePath, "utf-8")

const records = parse(csvData, {
  columns: true,
})

const precints = sortBy(
  sortBy(
    records.map((record) => {
      return {
        value: `${record["MUNICIPIO"]} - ${record["PRECINTO"]}`,
        precint: record["PRECINTO"],
      }
    }),
    "value"
  )
)

saveToDisk("precints", precints)
