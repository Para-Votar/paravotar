import groupBy from "lodash/groupBy.js"
import {
  assignCandidatesToPoliticalParties,
  getMaxAmountOfCandidates,
  getRepresentedParties,
} from "../utils.js"
import {
  MayorsHeader,
  MunicipalLegislatorHeader,
  PartiesHeaderMap,
} from "../constants.js"

export default function generateMunicipalityBallots(candidates) {
  const candidatesByMunicipality = groupBy(candidates, "2024_municipality")
  const ballots = {}

  Object.entries(candidatesByMunicipality).forEach(
    ([municipality, candidates]) => {
      const candidatesByParty = groupBy(candidates, "2024_party")
      const representedParties = getRepresentedParties(candidatesByParty)
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

      ballots[municipality] = [
        representedParties.map((party) => PartiesHeaderMap[party]),
        representedParties.map(() => MayorsHeader),
        ...candidateRows,
        representedParties.map(() => MunicipalLegislatorHeader),
      ]
    }
  )

  return ballots
}
