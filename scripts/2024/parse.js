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

const candidatesForGovernor = candidatesByPosition["gobernador"]
const candidatesForResidentCommissioner = candidatesByPosition["comisionado"]
const stateBallot = generateStateBallot(
  candidatesForGovernor,
  candidatesForResidentCommissioner
)

fs.writeFileSync("state-ballot.json", JSON.stringify(stateBallot, null, 2))

const candidatesForDistrictRepresentatives = groupBy(
  candidatesByPosition["representante"],
  "2024_representative_district"
)
const candidatesForDistrictSenators = groupBy(
  candidatesByPosition["senador"],
  "2024_senate_district"
)
const legislativeBallots = generateLegislativeBallots(
  candidatesForDistrictRepresentatives,
  candidatesForDistrictSenators
)

fs.writeFileSync(
  "legislative-ballots.json",
  JSON.stringify(legislativeBallots, null, 2)
)

const candidatesForMayor = candidatesByPosition["alcalde"]
const municipalityBallots = generateMunicipalityBallots(candidatesForMayor)

fs.writeFileSync(
  "municipality-ballots.json",
  JSON.stringify(municipalityBallots, null, 2)
)
