import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"
import groupBy from "lodash/groupBy.js"

import {
  assignCandidatesToPoliticalParties,
  getMaxAmountOfCandidates,
  getRepresentedParties,
  saveToDisk,
} from "../utils.js"
import {
  AtLargeRepresentativeHeader,
  AtLargeSenatorHeader,
  DistrictRepresentativeHeader,
  DistrictSenatorHeader,
  PartiesHeaderMap,
} from "../constants.js"

const csvFilePath = path.resolve("scripts/2024/data/district-breakdown.csv")
const csvData = fs.readFileSync(csvFilePath, "utf-8")

const records = parse(csvData, {
  columns: true,
})

const sortingFilePath = path.resolve(
  "scripts/2024/data/legislative-ballot-order.csv"
)
const sortingData = fs.readFileSync(sortingFilePath, "utf-8")

const candiadtesSortingRecords = parse(sortingData, {
  columns: true,
})

const candidateSortingByPrecinct = groupBy(candiadtesSortingRecords, "Precinct")

const precincts = groupBy(records, "PRECINTO")

function getAtLargeRepresentatives(
  atLargeRepresentativesByParty,
  representedParties
) {
  const amountOfAtLargeRepresentatives = getMaxAmountOfCandidates(
    atLargeRepresentativesByParty
  )

  const representativeRows = []

  for (let i = 0; i < amountOfAtLargeRepresentatives; i++) {
    const row = assignCandidatesToPoliticalParties(
      atLargeRepresentativesByParty,
      representedParties,
      i
    )

    representativeRows.push(row)
  }

  return representativeRows
}

function getAtLargeSenators(atLargeSenatorsByParty, representedParties) {
  const amountOfAtLargeSenators = getMaxAmountOfCandidates(
    atLargeSenatorsByParty
  )

  const senatorRows = []

  for (let i = 0; i < amountOfAtLargeSenators; i++) {
    const row = assignCandidatesToPoliticalParties(
      atLargeSenatorsByParty,
      representedParties,
      i
    )

    senatorRows.push(row)
  }

  return senatorRows
}

function sortPartyCandidates(candidatesByParty, sortingByPrecinct) {
  const result = {}

  Object.keys(candidatesByParty).forEach((party) => {
    const candidates = candidatesByParty[party]
    const sortedCandidates = new Array(candidates.length - 1)

    candidates.forEach((candidate) => {
      const fullName = `${candidate["first_name"]} ${candidate["last_name"]}`
      const sorting = sortingByPrecinct.find(
        (sorting) => sorting["Full Name"] === fullName
      )

      if (!sorting) {
        console.log("Missing sorting for", fullName)
        return
      }

      const index = Number(sorting["Order"]) - 1
      sortedCandidates[index] = candidate
    })

    result[party] = sortedCandidates
  })

  return result
}

export default function generateLegislativeBallots(representatives, senators) {
  const atLargeRepresentatives = representatives["ACUMULACION"]
  const atLargeRepresentativesByParty = groupBy(
    atLargeRepresentatives,
    "2024_party"
  )

  const atLargeSenators = senators["ACUMULACION"]
  const atLargeSenatorsByParty = groupBy(atLargeSenators, "2024_party")

  const ballots = Object.keys(precincts).map((precinctKey) => {
    const precinct = precincts[precinctKey][0]
    const municipality = precinct["MUNICIPIO"]
    const candidateSortingOnPrecinct =
      candidateSortingByPrecinct[precinct["PRECINTO"]]

    const districtSenators = senators[precinct["DIST. SEN"]]
    const districtSenatorsByParty = groupBy(districtSenators, "2024_party")

    const districtRepresentatives = representatives[precinct["DIST. REP."]]
    const districtRepresentativesByParty = groupBy(
      districtRepresentatives,
      "2024_party"
    )

    const representedParties = getRepresentedParties(
      atLargeRepresentativesByParty,
      atLargeSenatorsByParty,
      districtSenatorsByParty,
      districtRepresentativesByParty
    )

    const atLargeRepresentativesRows = getAtLargeRepresentatives(
      sortPartyCandidates(
        atLargeRepresentativesByParty,
        candidateSortingOnPrecinct
      ),
      representedParties
    )
    const atLargeSenatorsRows = getAtLargeSenators(
      sortPartyCandidates(atLargeSenatorsByParty, candidateSortingOnPrecinct),
      representedParties
    )

    const amountOfDistrictSenators = getMaxAmountOfCandidates(
      districtSenatorsByParty
    )
    const districtSenatorsRows = []

    for (let i = 0; i < amountOfDistrictSenators; i++) {
      const row = assignCandidatesToPoliticalParties(
        sortPartyCandidates(
          districtSenatorsByParty,
          candidateSortingOnPrecinct
        ),
        representedParties,
        i
      )

      districtSenatorsRows.push(row)
    }

    const amountOfDistrictRepresentatives = getMaxAmountOfCandidates(
      districtRepresentativesByParty
    )
    const districtRepresentativesRows = []

    for (let i = 0; i < amountOfDistrictRepresentatives; i++) {
      const row = assignCandidatesToPoliticalParties(
        districtRepresentativesByParty,
        representedParties,
        i
      )

      districtRepresentativesRows.push(row)
    }

    const ballot = [
      representedParties.map((party) => PartiesHeaderMap[party]),
      representedParties.map(() => DistrictRepresentativeHeader),
      ...districtRepresentativesRows,
      representedParties.map(() => DistrictSenatorHeader),
      ...districtSenatorsRows,
      representedParties.map(() => AtLargeRepresentativeHeader),
      ...atLargeRepresentativesRows,
      representedParties.map(() => AtLargeSenatorHeader),
      ...atLargeSenatorsRows,
    ]

    const folderName = `${municipality.toLowerCase()}-legislativo-${precinctKey}`

    saveToDisk(folderName, ballot)
  })

  return ballots
}
