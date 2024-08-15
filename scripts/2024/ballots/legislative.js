import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"
import groupBy from "lodash/groupBy.js"

import {
  assignCandidatesToPoliticalParties,
  getMaxAmountOfCandidates,
} from "../utils.js"
import {
  AtLargeRepresentativeHeader,
  AtLargeSenatorHeader,
  DistrictRepresentativeHeader,
  DistrictSenatorHeader,
  PartiesHeader,
} from "../constants.js"

const csvFilePath = path.resolve("scripts/2024/data/district-breakdown.csv")
const csvData = fs.readFileSync(csvFilePath, "utf-8")

const records = parse(csvData, {
  columns: true,
})

const precincts = groupBy(records, "PRECINTO")

function getAtLargeRepresentatives(representatives) {
  const atLargeRepresentatives = representatives["ACUMULACION"]
  const atLargeRepresentativesByParty = groupBy(
    atLargeRepresentatives,
    "2024_party"
  )
  const amountOfAtLargeRepresentatives = getMaxAmountOfCandidates(
    atLargeRepresentativesByParty
  )

  const representativeRows = []

  for (let i = 0; i < amountOfAtLargeRepresentatives; i++) {
    const row = assignCandidatesToPoliticalParties(
      atLargeRepresentativesByParty,
      i
    )

    representativeRows.push(row)
  }

  return representativeRows
}

function getAtLargeSenators(senators) {
  const atLargeSenators = senators["ACUMULACION"]
  const atLargeSenatorsByParty = groupBy(atLargeSenators, "2024_party")
  const amountOfAtLargeSenators = getMaxAmountOfCandidates(
    atLargeSenatorsByParty
  )

  const senatorRows = []

  for (let i = 0; i < amountOfAtLargeSenators; i++) {
    const row = assignCandidatesToPoliticalParties(atLargeSenatorsByParty, i)

    senatorRows.push(row)
  }

  return senatorRows
}

export default function generateLegislativeBallots(representatives, senators) {
  const atLargeRepresentativesRows = getAtLargeRepresentatives(representatives)
  const atLargeSenatorsRows = getAtLargeSenators(senators)

  const ballots = Object.keys(precincts).map((precinctKey) => {
    const precinct = precincts[precinctKey][0]

    const districtSenators = senators[precinct["DIST. SEN"]]
    const districtSenatorsByParty = groupBy(districtSenators, "2024_party")
    const amountOfDistrictSenators = getMaxAmountOfCandidates(
      districtSenatorsByParty
    )
    const districtSenatorsRows = []

    for (let i = 0; i < amountOfDistrictSenators; i++) {
      const row = assignCandidatesToPoliticalParties(districtSenatorsByParty, i)

      districtSenatorsRows.push(row)
    }

    const districtRepresentatives = representatives[precinct["DIST. REP."]]
    const districtRepresentativesByParty = groupBy(
      districtRepresentatives,
      "2024_party"
    )
    const amountOfDistrictRepresentatives = getMaxAmountOfCandidates(
      districtRepresentativesByParty
    )
    const districtRepresentativesRows = []

    for (let i = 0; i < amountOfDistrictRepresentatives; i++) {
      const row = assignCandidatesToPoliticalParties(
        districtRepresentativesByParty,
        i
      )

      districtRepresentativesRows.push(row)
    }

    return [
      PartiesHeader,
      DistrictRepresentativeHeader,
      ...districtRepresentativesRows,
      DistrictSenatorHeader,
      ...districtSenatorsRows,
      AtLargeRepresentativeHeader,
      ...atLargeRepresentativesRows,
      AtLargeSenatorHeader,
      ...atLargeSenatorsRows,
    ]
  })

  return ballots
}
