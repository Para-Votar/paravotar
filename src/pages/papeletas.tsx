import { useLocation, useNavigate } from "react-router-dom"
import { precintList } from "../packages/practica/constants"
import { Button, Layout } from "../components"
import Dropdown from "../components/button-dropdown"
import { useState } from "react"

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

  const location = useLocation()
  const navigate = useNavigate();
  
  const dropdownOptions = [
    { value: "estatal"},
  ]
  Object.entries(municipalityBallots).map(
    ([municipality, precincts]) => {
      dropdownOptions.push({ value: municipality });
      precincts.map((precinct) => {
        dropdownOptions.push({ value: precinct });
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
