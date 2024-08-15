import groupBy from "lodash/groupBy.js"

import { assignCandidatesToPoliticalParties } from "../utils.js"
import {
  GovernorsRoleHeader,
  PartiesHeader,
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

  const governorRow = assignCandidatesToPoliticalParties(governorByParty, 0)
  const residentCommissionerRow = assignCandidatesToPoliticalParties(
    residentCommissionerByParty,
    0
  )

  return [
    PartiesHeader,
    GovernorsRoleHeader,
    governorRow,
    ResidentComissionerHeader,
    residentCommissionerRow,
  ]
}
