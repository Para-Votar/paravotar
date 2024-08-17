import fs from "fs"
import path from "path"
import uniq from "lodash/uniq.js"

import { PoliticalParties } from "./constants.js"

const ACCENT_MAP = {
  á: "a",
  é: "e",
  í: "i",
  ó: "o",
  ú: "u",
  ñ: "n",
}

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

export function saveToDisk(folderName, data) {
  console.log("folder name -->>", folderName)
  const folder = folderName
    .replace(" ", "-")
    .toLowerCase()
    .split("")
    .map((char) => ACCENT_MAP[char] || char)
    .join("")
  const resultsDir = path.resolve("scripts/2024/results")
  const folderPath = path.resolve(resultsDir, folder)

  console.log(`Writing to: ${folderPath}`)

  // Create the folder if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
  }

  const dataPath = path.join(folderPath, "data.json")
  const jsonData = JSON.stringify(data, null, 2)

  // Write the data to data.json
  fs.writeFileSync(dataPath, jsonData)
}
