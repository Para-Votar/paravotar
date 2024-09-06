import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"
import groupBy from "lodash/groupBy.js"

import { saveToDisk } from "../utils.js"

const districsCsv = path.resolve("scripts/2024/data/district-breakdown.csv")
const districtsData = fs.readFileSync(districsCsv, "utf-8")

const districtRecords = parse(districtsData, {
  columns: true,
})

const allCandidatesCsv = path.resolve("scripts/2024/data/all-candidates.csv")
const candidatesData = fs.readFileSync(allCandidatesCsv, "utf-8")

const records = parse(candidatesData, {
  columns: true,
}).filter((record) => record["2024_general"] === "TRUE")

const candidatesByPosition = groupBy(records, "2024_politician_type")

const candidatesForDistrictRepresentatives = groupBy(
  candidatesByPosition["representante"],
  "2024_representative_district"
)
const candidatesForDistrictSenators = groupBy(
  candidatesByPosition["senador"],
  "2024_senate_district"
)

const precincts = groupBy(districtRecords, "PRECINTO")

function addCandidate(candidate, precinct, allCandidates) {
  const fullName = `${candidate["first_name"]} ${candidate["last_name"]}`

  if (allCandidates[fullName]) {
    allCandidates[fullName].order[`${precinct["PRECINTO"]}`] = null
  } else {
    allCandidates[fullName] = {
      order: {
        [`${precinct["PRECINTO"]}`]: null,
      },
    }
  }
}

export default function getCandidates() {
  const candidates = {}
  const atLargeRepresentatives =
    candidatesForDistrictRepresentatives["ACUMULACION"]
  const atLargeSenators = candidatesForDistrictSenators["ACUMULACION"]

  Object.keys(precincts).forEach((precinctKey) => {
    const precinct = precincts[precinctKey][0]
    const districtSenators =
      candidatesForDistrictSenators[precinct["DIST. SEN"]]

    districtSenators.forEach((senator) => {
      addCandidate(senator, precinct, candidates)
    })

    atLargeSenators.forEach((senator) => {
      addCandidate(senator, precinct, candidates)
    })

    atLargeRepresentatives.forEach((representative) => {
      addCandidate(representative, precinct, candidates)
    })
  })

  saveToDisk("legislative-ballot-candidates", candidates)
}

getCandidates()
