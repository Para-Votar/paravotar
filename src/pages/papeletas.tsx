import { Link } from "react-router-dom"
import { precintList } from "../packages/practica/constants"
import getNormalizedName from "../packages/practica/services/normalize-name"

function getBallots() {
  return precintList.reduce<{ [municipality: string]: string[] }>(
    (accum, precinct) => {
      const result = precinct.value.split("-")
      const municipality = result[0].trim()
      const precinctNumber = result[1].trim()

      if (!accum[municipality]) {
        return {
          ...accum,
          [municipality]: [precinctNumber],
        }
      }

      return {
        ...accum,
        [municipality]: [...accum[municipality], precinctNumber],
      }
    },
    {}
  )
}

const municipalityBallots = getBallots()

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
                <Link
                  to={`/papeletas/municipal/${getNormalizedName(municipality)}`}
                >
                  {municipality} - Municipal
                </Link>
              </li>
              {precincts.map((precinct) => (
                <li key={precinct}>
                  <Link to={`/papeletas/legislativa/${precinct}`}>
                    {municipality} - {precinct} - Legislativa
                  </Link>
                </li>
              ))}
            </>
          )
        )}
      </ul>
    </div>
  )
}
