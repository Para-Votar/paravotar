import ReactDOM from "react-dom/client"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import Spanish from "./locales/es/translations.json"
import English from "./locales/en/translations.json"

import SalAVotar from "./pages/sal-a-votar"
import "./styles/global.css"
import Practica from "./pages/practica"
import Inscribete from "./pages/inscribete"
import HazQueTuVotoCuente from "./pages/haz-que-tu-voto-cuente"
import NotFoundPage from "./pages/404"
import Colaboraciones from "./pages/colaboraciones"
import { StrictMode } from "react"
import Papeletas from "./pages/papeletas"
import Papeleta from "./pages/papeleta"
import GenerateBallot from "./pages/generate-ballot"

i18n.use(initReactI18next).init({
  fallbackLng: "es",
  resources: {
    es: {
      translations: Spanish,
    },
    en: {
      translations: English,
    },
  },
  ns: ["translations"],
  defaultNS: "translations",
  returnObjects: true,
  debug: import.meta.env.DEV,
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <Practica />,
  },
  {
    path: "/practica",
    element: <Practica />,
  },
  {
    path: "/inscribete",
    element: <Inscribete />,
  },
  {
    path: "/sal-a-votar",
    element: <SalAVotar />,
  },
  {
    path: "/haz-que-tu-voto-cuente",
    element: <HazQueTuVotoCuente />,
  },
  {
    path: "/generate-ballot",
    element: <GenerateBallot />,
  },
  {
    path: "/404",
    element: <NotFoundPage />,
  },
  {
    path: "/colaboraciones",
    element: <Colaboraciones />,
  },
  {
    path: "/papeletas",
    element: <Papeletas />,
  },
  {
    path: "/papeletas/:ballotType",
    element: <Papeleta />,
  },
  {
    path: "/papeletas/:ballotType/:id",
    element: <Papeleta />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
