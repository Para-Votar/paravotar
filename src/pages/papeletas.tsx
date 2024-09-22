import { useLocation, useNavigate } from "react-router-dom"
import { precintList } from "../packages/practica/constants"
import { Button, Container, Layout, Typography } from "../components"
import Dropdown from "../components/button-dropdown"
import { useState } from "react"
import getNormalizedName from "../packages/practica/services/normalize-name"
import SEO from "../components/seo"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const dropdownOptions = [{ value: "estatal", name: "Estatal" }]
  Object.entries(municipalityBallots).map(([municipality, precincts]) => {
    dropdownOptions.push({
      value: `municipal/${getNormalizedName(municipality)}`,
      name: `${municipality} - Municipal`,
    })
    precincts.map((precinct) => {
      dropdownOptions.push({
        value: `legislativa/${getNormalizedName(precinct)}`,
        name: `${municipality} - ${precinct} - Legislativa`,
      })
    })
  })

  const [selectedBallot, setSelectedBallot] = useState("estatal")

  return (
    <Layout location={location}>
      <SEO title="Papeletas electorales de Puerto Rico" />
      <Container
        className="w-11/12 pt-16 text-center lg:w-10/12 lg:mb-32 lg:pt-5"
        id="practica-tu-voto"
      >
        <Typography tag="h2" variant="h3" className="uppercase">
          {t("papeletas.escoge-una-papeleta")}
        </Typography>
        <Typography
          tag="h3"
          variant="h2"
          weight="base"
          className="font-normal mt-4"
        >
          {t("papeletas.escoge-y-ve-directo-a-la-papeleta")}
        </Typography>
        <Typography tag="p" variant="p" className="my-4">
          {t("papeletas.papeletas-interactivas")}
        </Typography>
        <Dropdown
          options={dropdownOptions}
          selectedOption={"estatal"}
          onSelect={(t: string) => {
            setSelectedBallot(t)
          }}
        />
        <Button
          className="my-4"
          onClick={() => navigate(`/papeletas/${selectedBallot}`)}
        >
          Navegar a la papeleta
        </Button>
      </Container>
    </Layout>
  )
}
