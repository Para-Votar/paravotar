import groupBy from "lodash/groupBy.js"
import {
  assignCandidatesToPoliticalParties,
  getMaxAmountOfCandidates,
} from "../utils.js"
import {
  MayorsHeader,
  MunicipalLegislatorHeader,
  PartiesHeader,
} from "../constants.js"

export default function generateMunicipalityBallots(candidates) {
  const candidatesByMunicipality = groupBy(candidates, "2024_municipality")
  const ballots = {}

  Object.entries(candidatesByMunicipality).forEach(
    ([municipality, candidates]) => {
      const candidatesByParty = groupBy(candidates, "2024_party")
      const amountOfCandidates = getMaxAmountOfCandidates(candidatesByParty)
      const candidateRows = []

      for (let i = 0; i < amountOfCandidates; i++) {
        const row = assignCandidatesToPoliticalParties(candidatesByParty, i)

        candidateRows.push(row)
      }

      ballots[municipality] = [
        PartiesHeader,
        MayorsHeader,
        ...candidateRows,
        MunicipalLegislatorHeader,
      ]
    }
  )

  return ballots
}
