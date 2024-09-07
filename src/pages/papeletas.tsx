import { Link } from "react-router-dom"
import { precintList } from "../packages/practica/constants"

function getMunicipalityBallots() {
  return precintList.reduce<{ [municipality: string]: string[] }>(
    (accum, precinct) => {
      const result = precinct.value.split("-")
      const municipality = result[0].toLowerCase().trim().replace(" ", "-")
      const precinctNumber = result[1].trim()

      const legislativeBallot = `${municipality}-legislativo-${precinctNumber}`

      if (!accum[municipality]) {
        return {
          ...accum,
          [municipality]: [legislativeBallot],
        }
      }

      return {
        ...accum,
        [municipality]: [...accum[municipality], legislativeBallot],
      }
    },
    {}
  )
}

const municipalityBallots = getMunicipalityBallots()

export default function Papeletas() {
  return (
    <div>
      <h1>Papeletas</h1>
      <ul>
        <li>
          <Link to="/papeletas/estatal">Estatal</Link>
        </li>
        {Object.entries(municipalityBallots).map(
          ([municipality, precincts]) => (
            <>
              <li key={municipality}>
                <Link to={`/papeletas/${municipality}`}>{municipality}</Link>
              </li>
              {precincts.map((precinct) => (
                <li key={precinct}>
                  <Link to={`/papeletas/${precinct}`}>{precinct}</Link>
                </li>
              ))}
            </>
          )
        )}
      </ul>
    </div>
  )
}
