import { useTranslation } from "react-i18next"
import { useLocation, useSearchParams } from "react-router-dom"
import { groupBy } from "lodash"

import { precintList } from "../packages/practica/constants"
import { Container, Layout, Link, Typography } from "../components"
import getNormalizedName from "../packages/practica/services/normalize-name"
import SEO from "../components/seo"
import BallotsByDistrict from "../components/ballots-by-district"
import BallotsByMunicipalities from "../components/ballots-by-municipalities"

function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

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

const precinctsByDistrictRep = groupBy(precintList, "districtRep")
const precinctsByDistrictSen = groupBy(precintList, "districtSen")

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
  districtRep: Object.entries(precinctsByDistrictRep).map(
    ([districtResp, precinct]) => {
      const precinctsByMunicipality = groupBy(precinct, "municipality")

      return {
        name: `Distrito Rep. ${districtResp}`,
        url: `distrito-representativo/${districtResp}`,
        municipalities: Object.entries(precinctsByMunicipality).map(
          ([municipality, precincts]) => {
            return {
              name: titleCase(municipality),
              url: `municipal/${getNormalizedName(municipality)}`,
              precincts: precincts.map((precinct) => {
                return {
                  url: `legislativa/${precinct.precint}`,
                  name: `${precinct.precint}`,
                }
              }),
            }
          }
        ),
      }
    }
  ),
  districtSen: Object.entries(precinctsByDistrictSen).map(
    ([districtSen, precinct]) => {
      const precinctsByMunicipality = groupBy(precinct, "municipality")
      const districtSenName = precinct[0].districtSenName

      return {
        name: `Distrito Senatorial ${districtSen} \n ${districtSenName}`,
        url: `distrito-senatorial/${districtSen}`,
        municipalities: Object.entries(precinctsByMunicipality).map(
          ([municipality, precincts]) => {
            return {
              name: titleCase(municipality),
              url: `municipal/${getNormalizedName(municipality)}`,
              precincts: precincts.map((precinct) => {
                return {
                  url: `legislativa/${precinct.precint}`,
                  name: `${precinct.precint}`,
                }
              }),
            }
          }
        ),
      }
    }
  ),
}

enum DisplayBy {
  Municipality = "municipality",
  DistrictRep = "district-rep",
  DistrictSen = "district-sen",
}

export default function Papeletas() {
  const [searchParams] = useSearchParams()
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
        <Typography tag="p" variant="p" className="my-4">
          {t("papeletas.papeletas-interactivas")}
        </Typography>
        <div className="flex flex-row justify-center gap-6 py-4 flex-wrap">
          <Typography tag="p" variant="p">
            Mostrar por:
          </Typography>
          <Link
            variant={
              !searchParams.has("displayBy") ||
              searchParams.get("displayBy") === DisplayBy.Municipality
                ? "primary"
                : "inverse"
            }
            to={`?displayBy=${DisplayBy.Municipality}`}
          >
            Municipios
          </Link>
          <Link
            variant={
              searchParams.get("displayBy") === DisplayBy.DistrictSen
                ? "primary"
                : "inverse"
            }
            to={`?displayBy=${DisplayBy.DistrictSen}`}
          >
            Distritos Senatoriales
          </Link>
          <Link
            variant={
              searchParams.get("displayBy") === DisplayBy.DistrictRep
                ? "primary"
                : "inverse"
            }
            to={`?displayBy=${DisplayBy.DistrictRep}`}
          >
            Distritos Representativos
          </Link>
        </div>
        <section className="grid grid-cols-1 gap-x-4 gap-y-8 pt-8 md:grid-cols-4">
          {(!searchParams.has("displayBy") ||
            searchParams.get("displayBy") === DisplayBy.Municipality) && (
            <BallotsByMunicipalities
              state={allBallots.state}
              municipalities={allBallots.municipalities}
            />
          )}
          {searchParams.get("displayBy") === DisplayBy.DistrictRep && (
            <BallotsByDistrict districts={allBallots.districtRep} />
          )}
          {searchParams.get("displayBy") === DisplayBy.DistrictSen && (
            <BallotsByDistrict districts={allBallots.districtSen} />
          )}
        </section>
      </Container>
    </Layout>
  )
}
