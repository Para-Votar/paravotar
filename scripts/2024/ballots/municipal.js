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
  MayorsHeader,
  MunicipalLegislatorHeader,
  PartiesHeaderMap,
} from "../constants.js"

const csvFilePath = path.resolve("scripts/2024/data/municipal-legislators.csv")
const csvData = fs.readFileSync(csvFilePath, "utf-8")

const municipalLegislatorsRecords = parse(csvData, {
  columns: true,
})

export default function generateMunicipalityBallots(candidates) {
  const candidatesByMunicipality = groupBy(candidates, "2024_municipality")
  const municipalLegislatorsByMunicipality = groupBy(
    municipalLegislatorsRecords,
    "municipality"
  )
  const ballots = {}

  Object.entries(candidatesByMunicipality).forEach(
    ([municipality, candidates]) => {
      const candidatesByParty = groupBy(candidates, "2024_party")
      const municipalLegislators =
        municipalLegislatorsByMunicipality[municipality]
      const municipalLegislatorsByParty = groupBy(municipalLegislators, "party")
      const representedParties = getRepresentedParties(
        candidatesByParty,
        municipalLegislatorsByParty
      )
      const amountOfCandidates = getMaxAmountOfCandidates(candidatesByParty)
      const candidateRows = []

      for (let i = 0; i < amountOfCandidates; i++) {
        const row = assignCandidatesToPoliticalParties(
          candidatesByParty,
          representedParties,
          i
        )

        candidateRows.push(row)
      }

      const amountOfMunicipalLegislators = getMaxAmountOfCandidates(
        municipalLegislatorsByParty
      )
      const municipalLegislatorsRows = []

      for (let i = 0; i < amountOfMunicipalLegislators; i++) {
        const row = assignCandidatesToPoliticalParties(
          municipalLegislatorsByParty,
          representedParties,
          i
        )

        municipalLegislatorsRows.push(row)
      }

      const ballot = [
        representedParties.map((party) => PartiesHeaderMap[party]),
        representedParties.map(() => MayorsHeader),
        ...candidateRows,
        representedParties.map(() => MunicipalLegislatorHeader),
        ...municipalLegislatorsRows,
      ]

      saveToDisk(`${municipality.toLowerCase()}`, ballot)
    }
  )

  return ballots
}
