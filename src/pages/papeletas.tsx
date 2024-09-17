import { useLocation, useNavigate } from "react-router-dom"
import { precintList } from "../packages/practica/constants"
import { Button, Layout } from "../components"
import Dropdown from "../components/button-dropdown"
import { useState } from "react"
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

  const location = useLocation()
  const navigate = useNavigate();
  
  const dropdownOptions = [
    { value: "estatal", name: "Estatal"},
  ]
  Object.entries(municipalityBallots).map(
    ([municipality, precincts]) => {
      dropdownOptions.push({ value: getNormalizedName(municipality), name: `${municipality} - Municipal` });
      precincts.map((precinct) => {
        dropdownOptions.push({ value: precinct, name: `${municipality} - ${precinct} - Legislativa`});
      })
    }
  )

  const [selectedBallot, setSelectedBallot] = useState('estatal');


  return (
    <Layout location={location}>
    <div className='m-4'>
      <h1>Escoge una papeleta</h1>
      <Dropdown
        options={dropdownOptions}
        selectedOption={'estatal'}
        onSelect={(t: string) => {
          setSelectedBallot(t);
        }}
      />
      <Button className="my-4" onClick={() => navigate(`/papeletas/${selectedBallot}`)}>Navegar a la papeleta</Button>
      </div>
    </Layout>
  )
}
