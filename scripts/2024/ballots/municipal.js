import groupBy from "lodash/groupBy.js"
import {
  assignCandidatesToPoliticalParties,
  getMaxAmountOfCandidates,
} from "../utils.js"
import {
  MayorsHeader,
  MunicipalLegislatorHeader,
  PartiesHeader,
  PartiesHeaderMap,
  PoliticalParties,
  WriteInInstructions,
} from "../constants.js"

export default function generateMunicipalityBallots(candidates) {
  const candidatesByMunicipality = groupBy(candidates, "2024_municipality")
  const ballots = {}

  Object.entries(candidatesByMunicipality).forEach(
    ([municipality, candidates]) => {
      const candidatesByParty = groupBy(candidates, "2024_party")
      const partiesRepresented = Object.keys(candidatesByParty)
      const amountOfCandidates = getMaxAmountOfCandidates(candidatesByParty)
      const candidateRows = []

      for (let i = 0; i < amountOfCandidates; i++) {
        const row = assignCandidatesToPoliticalParties(candidatesByParty, i)

        candidateRows.push(row)
      }

      const mayorsHeader = []

      for (let i = 0; i < candidateRows[0].length; i++) {
        mayorsHeader.push(MayorsHeader)
      }

      const municipalLegislatorsHeader = []

      for (let i = 0; i < candidateRows[0].length; i++) {
        municipalLegislatorsHeader.push(MunicipalLegislatorHeader)
      }

      ballots[municipality] = [
        PartiesHeader,
        mayorsHeader,
        ...candidateRows,
        municipalLegislatorsHeader,
      ]
    }
  )

  return ballots
}
