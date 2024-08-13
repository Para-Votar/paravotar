import groupBy from "lodash/groupBy.js"

import { PoliticalParties } from "../constants.js"
import { convertToOcrResult } from "../utils.js"

function getAtLargeRepresentatives(representatives) {
  const atLargeRepresentatives = representatives["ACUMULACION"]
  const atLargeRepresentativesByParty = groupBy(
    atLargeRepresentatives,
    "2024_party"
  )
  const amountOfAtLargeRepresentatives = Object.keys(
    atLargeRepresentativesByParty
  ).reduce((accum, key) => {
    const representatives = atLargeRepresentativesByParty[key]

    if (representatives.length > accum) {
      return representatives.length
    }

    return accum
  }, 0)

  const representativeRows = []

  for (let i = 0; i < amountOfAtLargeRepresentatives; i++) {
    const row = PoliticalParties.map((party, index) => {
      const representative = atLargeRepresentativesByParty[party]

      if (!representative) {
        return convertToOcrResult(null, i + 1)
      }

      return convertToOcrResult(representative[i], i + 1)
    })

    representativeRows.push(row)
  }

  return representativeRows
}

function getAtLargeSenators(senators) {
  const atLargeSenators = senators["ACUMULACION"]
  const atLargeSenatorsByParty = groupBy(atLargeSenators, "2024_party")
  const amountOfAtLargeSenators = Object.keys(atLargeSenatorsByParty).reduce(
    (accum, key) => {
      const senators = atLargeSenatorsByParty[key]

      if (senators.length > accum) {
        return senators.length
      }

      return accum
    },
    0
  )

  const senatorRows = []

  for (let i = 0; i < amountOfAtLargeSenators; i++) {
    const row = PoliticalParties.map((party, index) => {
      const senator = atLargeSenatorsByParty[party]

      if (!senator) {
        return convertToOcrResult(null, i + 1)
      }

      return convertToOcrResult(senator[i], i + 1)
    })

    senatorRows.push(row)
  }

  return senatorRows
}

export default function generateLegislativeBallot(representatives, senators) {
  const atLargeRepresentativesRows = getAtLargeRepresentatives(representatives)
  const atLargeSenatorsRows = getAtLargeSenators(senators)

  return [atLargeRepresentativesRows, atLargeSenatorsRows]
}
