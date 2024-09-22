import "fetch-ponyfill"

import { Layout, Container } from "../components/index"
import {
  HowToVote,
  MakeYourVoteCount,
} from "../packages/practica/components/index"
import { useLocation } from "react-router-dom"
import SEO from "../components/seo"
import useScrollIntoView from "../hooks/useScrollIntoView"

const HazQueTuVotoCuente = () => {
  const location = useLocation()

  useScrollIntoView()

  return (
    <Layout location={location}>
      <SEO title="Cómo votar en Puerto Rico" />
      <Container
        className="practice-container pt-16 mb-16 text-center lg:pt-5"
        id="haz-que-tu-voto-cuente"
      >
        <MakeYourVoteCount />
      </Container>
      <Container
        className="practice-container pt-16 mb-16 text-center lg:pt-5"
        id="como-votar"
      >
        <HowToVote />
      </Container>
    </Layout>
  )
}

export default HazQueTuVotoCuente
