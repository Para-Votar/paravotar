import uniq from "lodash/uniq.js"
import { PoliticalParties } from "./constants.js"

export function convertToOcrResult(record, index) {
  if (!record) {
    return {
      ocrResult: "",
    }
  }

  const picturePath = record["picture"].split("/")
  const candidateImg = picturePath[picturePath.length - 1]

  return {
    ocrResult: `${index}. ${record["first_name"]} ${record["last_name"]}`,
    logoImg: candidateImg,
  }
}

export function getRepresentedParties(...candidatesByParty) {
  const parties = candidatesByParty.map((candidates) => Object.keys(candidates))
  const representedParties = uniq(parties.flat(2))

  return [
    ...PoliticalParties.filter((party) => representedParties.includes(party)),
    "WI",
  ]
}

export function assignCandidatesToPoliticalParties(
  candidatesByParty,
  representedParties,
  rowNumber
) {
  return representedParties.map((party) => {
    const candidate = candidatesByParty[party]

    if (!candidate) {
      return convertToOcrResult(null, rowNumber + 1)
    }

    return convertToOcrResult(candidate[rowNumber], rowNumber + 1)
  })
}

export function getMaxAmountOfCandidates(partyCandidates) {
  return Object.keys(partyCandidates).reduce((accum, key) => {
    const senators = partyCandidates[key]

    if (senators.length > accum) {
      return senators.length
    }

    return accum
  }, 0)
}
