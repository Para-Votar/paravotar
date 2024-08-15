import groupBy from "lodash/groupBy.js"

import {
  assignCandidatesToPoliticalParties,
  getRepresentedParties,
} from "../utils.js"
import {
  GovernorsRoleHeader,
  PartiesHeaderMap,
  ResidentComissionerHeader,
} from "../constants.js"

export default function generateStateBallot(
  candidatesForGovernor,
  candidatesForResidentCommissioner
) {
  const governorByParty = groupBy(candidatesForGovernor, "2024_party")
  const residentCommissionerByParty = groupBy(
    candidatesForResidentCommissioner,
    "2024_party"
  )
  const representedParties = getRepresentedParties(
    governorByParty,
    residentCommissionerByParty
  )
  const governorRow = assignCandidatesToPoliticalParties(
    governorByParty,
    representedParties,
    0
  )
  const residentCommissionerRow = assignCandidatesToPoliticalParties(
    residentCommissionerByParty,
    representedParties,
    0
  )

  return [
    representedParties.map((party) => PartiesHeaderMap[party]),
    representedParties.map(() => GovernorsRoleHeader),
    governorRow,
    representedParties.map(() => ResidentComissionerHeader),
    residentCommissionerRow,
  ]
}
