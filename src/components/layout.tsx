import { ReactNode } from "react"
import { Footer, Navbar } from "../components/index"
import { Location } from "react-router-dom"

type Props = {
  children: ReactNode
  location: Location
}

const Layout = ({ children, location }: Props) => {
  const hash = location.hash || ""
  const pathname = location.pathname || ""

  return (
    <>
      <a
        className="absolute overflow-hidden text-center w-1 h-1 mt-1 mx-1 focus:w-full focus:h-auto focus:overflow-none focus:z-50 focus:bg-secondary"
        href="#main-content"
      >
        Ir al contenido principal
      </a>
      <Navbar pathname={`${pathname}${hash}`} />
      <div className="wrapper wrapper-without-sidebar">
        <div id="main-container" className="main">
          <main id="main-content" className="main-content max-w-screen-2xl">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Layout
