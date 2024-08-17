import { useMemo } from "react"

import { useTranslation } from "react-i18next"

import Practica from "../assets/icons/practica.svg?url"
import Logo from "../assets/images/logo.svg?url"
import { useSidebar } from "../context/sidebar-context"
import { Section, SubSection } from "./section"
import LanguageMenu from "./language-menu"
import Arrows from "./arrows"
import { TFunction } from "i18next"

type SidebarProps = {
  pathname: string
}

export const getSections = (
  pathname = "",
  t: TFunction<"translation", null>
) => [
  {
    name: "Practica",
    icon: Practica,
    isActive:
      pathname.includes("/haz-que-tu-voto-cuente#haz-que-tu-voto-cuente") ||
      pathname.includes("/practica#practica-tu-voto") ||
      pathname.includes("/haz-que-tu-voto-cuente#como-votar"),
    strikeout: false,
    subsections: [
      {
        name: "Haz que tu voto cuente",
        route: "/haz-que-tu-voto-cuente#haz-que-tu-voto-cuente",
        isActive: pathname.includes(
          "/haz-que-tu-voto-cuente#haz-que-tu-voto-cuente"
        ),
      },
      {
        name: "¿Cómo votar?",
        route: "/haz-que-tu-voto-cuente#como-votar",
        isActive: pathname.includes("/haz-que-tu-voto-cuente#como-votar"),
      },
      {
        name: "Practica tu voto",
        route: "/practica#practica-tu-voto",
        isActive: pathname.includes("/practica#practica-tu-voto"),
      },
    ],
  },
]

export default function Sidebar({ pathname }: SidebarProps) {
  const { t } = useTranslation()
  const sections = useMemo(() => getSections(pathname, t), [pathname, t])
  const { setSidebarIsVisible } = useSidebar()

  return (
    <nav className="sidebar">
      <aside className="sticky h-screen top-0">
        <div className="relative px-4">
          <img className="h-24" src={Logo} alt="Para Votar" />
          <div className="sidebar__translate">
            <LanguageMenu />
          </div>
        </div>
        <div className="mt-6">
          {sections.map((section, index) => {
            return (
              <Section
                key={`${section.name}-${index}`}
                name={section.name}
                icon={section.icon}
                isActive={section.isActive}
                strikeout={section.strikeout}
              >
                {section.subsections.map((subsection, index) => {
                  return (
                    <SubSection
                      key={`${section.subsections}-${index}`}
                      name={subsection.name}
                      route={subsection.route}
                      isActive={subsection.isActive}
                    />
                  )
                })}
              </Section>
            )
          })}
        </div>
        <button
          className="flex items-center absolute bottom-0 border border-footer border-b-0 border-r-0 border-l-0 py-3 px-4"
          style={{ width: 275 }}
          onClick={() => setSidebarIsVisible(false)}
        >
          <Arrows className="mr-4" style={{ transform: "rotate(90deg)" }} />
          {t("nav.hide-menu")}
        </button>
      </aside>
    </nav>
  )
}
