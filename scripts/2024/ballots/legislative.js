import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"

import groupBy from "lodash/groupBy.js"

import { PoliticalParties } from "../constants.js"
import { convertToOcrResult } from "../utils.js"

const PoliticalPartiesHeader = [
  {
    ocrResult: "PARTIDO NUEVO PROGRESISTA\r\n",
    logoImg: "images/1-partido-logo-1.jpg",
  },
  {
    ocrResult: "PARTIDO POPULAR\r\nDEMOCRÁTICO\r\n",
    logoImg: "images/1-partido-logo-2.jpg",
  },
  {
    ocrResult: "PARTIDO INDEPENDENTISTA\r\nPUERTORRIQUEÑO\r\n",
    logoImg: "images/1-partido-logo-3.jpg",
  },
  {
    ocrResult: "MOVIMIENTO VICTORIA\r\nCIUDADANA\r\n",
    logoImg: "images/1-partido-logo-4.jpg",
  },
  {
    ocrResult: "PROYECTO DIGNIDAD\r\n",
    logoImg: "images/1-partido-logo-5.jpg",
  },
  {
    ocrResult: "",
  },
]

const DistrictRepresentativeHeader = [
  {
    ocrResult: "REPRESENTANTE POR DISTRITO\r\nDISTRICT REPRESENTATIVE\r\n",
  },
  {
    ocrResult: "REPRESENTANTE POR DISTRITO\r\nDISTRICT REPRESENTATIVE\r\n",
  },
  {
    ocrResult: "REPRESENTANTE POR DISTRITO\r\nDISTRICT REPRESENTATIVE\r\n",
  },
  {
    ocrResult: "REPRESENTANTE POR DISTRITO\r\nDISTRICT REPRESENTATIVE\r\n",
  },
  {
    ocrResult: "REPRESENTANTE POR DISTRITO\r\nDISTRICT REPRESENTATIVE\r\n",
  },
  {
    ocrResult: "REPRESENTANTE POR DISTRITO\r\nDISTRICT REPRESENTATIVE\r\n",
  },
]

const DistrictSenatorHeader = [
  {
    ocrResult: "SENADOR POR DISTRITO\r\nDISTRICT SENATOR\r\n",
  },
  {
    ocrResult: "SENADOR POR DISTRITO\r\nDISTRICT SENATOR\r\n",
  },
  {
    ocrResult: "SENADOR POR DISTRITO\r\nDISTRICT SENATOR\r\n",
  },
  {
    ocrResult: "SENADOR POR DISTRITO\r\nDISTRICT SENATOR\r\n",
  },
  {
    ocrResult: "SENADOR POR DISTRITO\r\nDISTRICT SENATOR\r\n",
  },
  {
    ocrResult: "SENADOR POR DISTRITO\r\nDISTRICT SENATOR\r\n",
  },
]

const AtLargeSenatorHeader = [
  {
    ocrResult: "SENADOR POR ACUMULACIÓN\r\nAT-LARGE SENATOR\r\n",
  },
  {
    ocrResult: "SENADOR POR ACUMULACIÓN\r\nAT-LARGE SENATOR\r\n",
  },
  {
    ocrResult: "SENADOR POR ACUMULACIÓN\r\nAT-LARGE SENATOR\r\n",
  },
  {
    ocrResult: "SENADOR POR ACUMULACIÓN\r\nAT-LARGE SENATOR\r\n",
  },
  {
    ocrResult: "SENADOR POR ACUMULACIÓN\r\nAT-LARGE SENATOR\r\n",
  },
  {
    ocrResult: "SENADOR POR ACUMULACIÓN\r\nAT-LARGE SENATOR\r\n",
  },
]

const AtLargeRepresentativeHeader = [
  {
    ocrResult: "REPRESENTANTE POR ACUMULACIÓN\r\nAT-LARGE REPRESENTATIVE\r\n",
  },
  {
    ocrResult: "REPRESENTANTE POR ACUMULACIÓN\r\nAT-LARGE REPRESENTATIVE\r\n",
  },
  {
    ocrResult: "REPRESENTANTE POR ACUMULACIÓN\r\nAT-LARGE REPRESENTATIVE\r\n",
  },
  {
    ocrResult: "REPRESENTANTE POR ACUMULACIÓN\r\nAT-LARGE REPRESENTATIVE\r\n",
  },
  {
    ocrResult: "REPRESENTANTE POR ACUMULACIÓN\r\nAT-LARGE REPRESENTATIVE\r\n",
  },
  {
    ocrResult: "REPRESENTANTE POR ACUMULACIÓN\r\nAT-LARGE REPRESENTATIVE\r\n",
  },
]

const csvFilePath = path.resolve("scripts/2024/district-breakdown.csv")
const csvData = fs.readFileSync(csvFilePath, "utf-8")

const records = parse(csvData, {
  columns: true,
})

const precincts = groupBy(records, "PRECINTO")

function getAmountOfCandidates(partyCandidates) {
  return Object.keys(partyCandidates).reduce((accum, key) => {
    const senators = partyCandidates[key]

    if (senators.length > accum) {
      return senators.length
    }

    return accum
  }, 0)
}

function getAtLargeRepresentatives(representatives) {
  const atLargeRepresentatives = representatives["ACUMULACION"]
  const atLargeRepresentativesByParty = groupBy(
    atLargeRepresentatives,
    "2024_party"
  )
  const amountOfAtLargeRepresentatives = getAmountOfCandidates(
    atLargeRepresentativesByParty
  )

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
  const amountOfAtLargeSenators = getAmountOfCandidates(atLargeSenatorsByParty)

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

export default function generateLegislativeBallots(representatives, senators) {
  const atLargeRepresentativesRows = getAtLargeRepresentatives(representatives)
  const atLargeSenatorsRows = getAtLargeSenators(senators)

  const ballots = Object.keys(precincts).map((precinctKey) => {
    const precinct = precincts[precinctKey][0]

    const districtSenators = senators[precinct["DIST. SEN"]]
    const districtSenatorsByParty = groupBy(districtSenators, "2024_party")
    const amountOfDistrictSenators = getAmountOfCandidates(
      districtSenatorsByParty
    )
    const districtSenatorsRows = []

    for (let i = 0; i < amountOfDistrictSenators; i++) {
      const row = PoliticalParties.map((party, index) => {
        const senator = districtSenatorsByParty[party]

        if (!senator) {
          return convertToOcrResult(null, i + 1)
        }

        return convertToOcrResult(senator[i], i + 1)
      })

      districtSenatorsRows.push(row)
    }

    const districtRepresentatives = representatives[precinct["DIST. REP."]]
    const districtRepresentativesByParty = groupBy(
      districtRepresentatives,
      "2024_party"
    )
    const amountOfDistrictRepresentatives = getAmountOfCandidates(
      districtRepresentativesByParty
    )
    const districtRepresentativesRows = []

    for (let i = 0; i < amountOfDistrictRepresentatives; i++) {
      const row = PoliticalParties.map((party, index) => {
        const representative = districtRepresentativesByParty[party]

        if (!representative) {
          return convertToOcrResult(null, i + 1)
        }

        return convertToOcrResult(representative[i], i + 1)
      })

      districtRepresentativesRows.push(row)
    }

    return [
      PoliticalPartiesHeader,
      DistrictRepresentativeHeader,
      ...districtRepresentativesRows,
      DistrictSenatorHeader,
      ...districtSenatorsRows,
      AtLargeRepresentativeHeader,
      ...atLargeRepresentativesRows,
      AtLargeSenatorHeader,
      ...atLargeSenatorsRows,
    ]
  })

  return ballots
}
