import { useRef, useState, useEffect, useMemo } from "react"

import Logo from "../assets/images/logo.svg?url"
import Close from "../assets/icons/close.svg?url"
import Menu from "../assets/icons/menu.svg?url"
import { Section } from "./section"
import LanguageMenu from "./language-menu"
import Link from "./link"

const getSections = (pathname = "") => [
  {
    name: "¿Cómo votar?",
    route: "/haz-que-tu-voto-cuente#como-votar",
    isActive: pathname.includes("/haz-que-tu-voto-cuente#como-votar"),
  },
  {
    name: "Practica tu voto",
    route: "/practica",
    isActive: pathname.includes("/practica"),
  },
  {
    name: "Candidatos",
    route: "https://www.quienmerepresentapr.com",
    isActive: false,
  },
  {
    name: "Colaboradores",
    route: "/colaboraciones",
    isActive: pathname.includes("/colaboraciones"),
  },
]

type SidebarProps = {
  pathname: string
}

interface HTMLDivElementWithInert extends HTMLDivElement {
  inert: boolean
}

export default function Navbar({ pathname }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElementWithInert>(null)
  const sections = useMemo(() => getSections(pathname), [pathname])

  useEffect(() => {
    if (menuRef && menuRef.current) {
      menuRef.current.inert = !isOpen
    }
  }, [isOpen])

  return (
    <>
      <nav className="flex items-center justify-between bg-navbar sticky h-16 px-4 top-0 z-50 shadow-md">
        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          <img className="h-6 w-6" src={Menu} alt="Mobile Menu" />
        </button>
        <Link to="/">
          <img className="h-12 -mt-1" src={Logo} alt="Para Votar" />
        </Link>
        <ul className="hidden flex gap-2 lg:flex">
          {sections.map((section) => {
            return (
              <Section
                key={section.name}
                name={section.name}
                route={section.route}
                isActive={section.isActive}
              />
            )
          })}
        </ul>
        <div className="lg:hidden" />
      </nav>
      <div
        className={`fixed bg-navbar h-screen w-screen z-50 pt-12 transform ease-linear duration-300 ${
          isOpen ? "top-0" : "-top-h-screen"
        }`}
        ref={menuRef}
      >
        <button
          className="absolute top-0 right-0 mt-2 mr-2"
          onClick={() => setIsOpen(false)}
        >
          <img className="h-5 w-5" src={Close} alt="Close Menu" />
        </button>
        <div className="px-4">
          <img className="mx-auto h-16" src={Logo} alt="Para Votar" />
          <div className="text-center mt-2">
            <LanguageMenu />
          </div>
        </div>
        <div className="mt-10">
          <ul>
            {sections.map((section) => {
              return (
                <Section
                  key={section.name}
                  name={section.name}
                  route={section.route}
                  isActive={section.isActive}
                />
              )
            })}
          </ul>
        </div>
      </div>
    </>
  )
}
