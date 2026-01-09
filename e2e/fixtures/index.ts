// Mock API responses for E2E tests
// These are copied from src/mirage/fixtures

export const ballotsByPrecint = {
  estatal: "papeletas/2024/estatal/",
  municipal: "papeletas/2020/aguada/",
  legislativa: "papeletas/2020/aguada-legislativa-038/",
}

export { default as stateBallot } from "../../src/mirage/fixtures/state-ballot"
export { default as municipalBallot } from "../../src/mirage/fixtures/municipal-ballot"
export { default as legislativeBallot } from "../../src/mirage/fixtures/legislative-ballot"
