import { useLocation } from "react-router-dom"
import { precintList } from "../packages/practica/constants"
import { Container, Layout, Link, Typography } from "../components"
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

const allBallots = {
  state: { url: "estatal", name: "Estatal" },
  municipalities: Object.entries(getBallots()).map(
    ([municipality, precincts]) => {
      const normalizedMunicipality = getNormalizedName(municipality)

      return {
        name: municipality,
        url: `municipal/${normalizedMunicipality}`,
        precincts: precincts.map((precinct) => {
          return {
            url: `legislativa/${precinct}`,
            name: `Legislativa - Precinto ${precinct}`,
          }
        }),
      }
    }
  ),
}

export default function Papeletas() {
  const { t } = useTranslation()
  const location = useLocation()

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
        <section className="grid grid-cols-1 gap-x-4 gap-y-8 pt-8 md:grid-cols-4">
          <div>
            <Typography tag="h3" variant="h3" className="uppercase">
              {allBallots.state.name}
            </Typography>
            <Link to={`/papeletas/${allBallots.state.url}`} className="block">
              Papeleta
            </Link>
          </div>
          {allBallots.municipalities.map((municipality) => (
            <div>
              <Typography tag="h3" variant="h3" className="uppercase">
                {municipality.name}
              </Typography>
              <Link
                to={`/papeletas/${municipality.url}`}
                className="block my-2"
              >
                Municipal
              </Link>
              {municipality.precincts.map((option) => (
                <Link
                  key={option.url}
                  to={`/papeletas/${option.url}`}
                  className="block my-2"
                >
                  {option.name}
                </Link>
              ))}
            </div>
          ))}
        </section>
      </Container>
    </Layout>
  )
}
