import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"

import groupBy from "lodash/groupBy.js"
import generateStateBallot from "./ballots/state.js"
import generateLegislativeBallots from "./ballots/legislative.js"
import generateMunicipalityBallots from "./ballots/municipal.js"

const csvFilePath = path.resolve("scripts/2024/data/all-candidates.csv")
const csvData = fs.readFileSync(csvFilePath, "utf-8")

const records = parse(csvData, {
  columns: true,
}).filter((record) => record["2024_general"] === "TRUE")

const candidatesByPosition = groupBy(records, "2024_politician_type")

// State ballot
const candidatesForGovernor = candidatesByPosition["gobernador"]
const candidatesForResidentCommissioner = candidatesByPosition["comisionado"]
generateStateBallot(candidatesForGovernor, candidatesForResidentCommissioner)

const candidatesForDistrictRepresentatives = groupBy(
  candidatesByPosition["representante"],
  "2024_representative_district"
)
const candidatesForDistrictSenators = groupBy(
  candidatesByPosition["senador"],
  "2024_senate_district"
)

generateLegislativeBallots(
  candidatesForDistrictRepresentatives,
  candidatesForDistrictSenators
)

const candidatesForMayor = candidatesByPosition["alcalde"]
generateMunicipalityBallots(candidatesForMayor)
