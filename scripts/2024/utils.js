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

export function assignCandidatesToPoliticalParties(
  candidatesByParty,
  rowNumber
) {
  return PoliticalParties.map((party) => {
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
