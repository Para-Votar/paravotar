import { useLocation } from "react-router-dom"

import { Container, Layout } from "../components"
import Collabs from "../packages/colaboraciones/components/collabs"
import SEO from "../components/seo"
import useScrollIntoView from "../hooks/useScrollIntoView"

const Inscribete = () => {
  const location = useLocation()

  useScrollIntoView()

  return (
    <Layout location={location}>
      <SEO title="Colaboraciones" />
      <Container className="w-11/12 pt-16 mb-16 text-center lg:w-10/12 lg:mb-32 lg:pt-5">
        <Collabs />
      </Container>
    </Layout>
  )
}

export default Inscribete
