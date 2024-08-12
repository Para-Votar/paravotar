import groupBy from "lodash/groupBy.js"

import { PoliticalParties } from "../constants.js"
import { convertToOcrResult } from "../utils.js"

const PartiesHeader = [
  {
    ocrResult: "PARTIDO NUEVO PROGRESISTA\r\n",
    logoImg: "images/partido-logo-1.jpg",
  },
  {
    ocrResult: "PARTIDO POPULAR\r\nDEMOCRÁTICO\r\n",
    logoImg: "images/partido-logo-2.jpg",
  },
  {
    ocrResult: "PARTIDO INDEPENDENTISTA\r\nPUERTORRIQUEÑO\r\n",
    logoImg: "images/partido-logo-3.jpg",
  },
  {
    ocrResult: "MOVIMIENTO VICTORIA\r\nCIUDADANA\r\n",
    logoImg: "images/partido-logo-4.jpg",
  },
  {
    ocrResult: "PROYECTO DIGNIDAD\r\n",
    logoImg: "images/partido-logo-5.jpg",
  },
  {
    ocrResult: "",
  },
  {
    ocrResult:
      "cóM0 VOTAR NOMINACIÓN DIRECTA\r\nEn esta columna puede votar por otra(s) persona(s) distinta(s) a las que\r\naparecen como candidatos(as) en columnas anteriores de esta\r\npapeleta. Para votar por la(s) persona(s) de su preferencia. escriba su\r\nnombre completo en el encasillado de la columna de nominación directa\r\nque corresponda a la candidatura y también debe hacer una Marca\r\nVálida dentro del rectángulo en blanco al lado de cada nombre escrito.\r\nHOW TO VOTE FOR WRITE W CANDIDATES\r\nIn this column yol,' can vote for another person(s) difterent from those\r\nlisted as candidates in the previous columns ofthis ballot To vote for the\r\nperson(s) of chojce, write their full name on the box of the write-in\r\ncolumn that corresponds to the candidacy, and you must also make a\r\nvalid mark with\\n the blank rectang/e next to gach vritfen name.\r\n",
  },
]

const GovernorsRoleHeader = [
  {
    ocrResult: "GOBERNADOR\r\nGOVERNOR\r\n",
  },
  {
    ocrResult: "GOBERNADOR\r\nGOVERNOR\r\n",
  },
  {
    ocrResult: "GOBERNADOR\r\nGOVERNOR\r\n",
  },
  {
    ocrResult: "GOBERNADOR\r\nGOVERNOR\r\n",
  },
  {
    ocrResult: "GOBERNADOR\r\nGOVERNOR\r\n",
  },
  {
    ocrResult: "GOBERNADOR\r\nGOVERNOR\r\n",
  },
  {
    ocrResult: "GOBERNADOR\r\nGOVERNOR\r\n",
  },
]

const ResidentComissionerHeader = [
  {
    ocrResult: "COMISIONADO RESIDENTE\r\nRESIDENT COMMISSIONER\r\n",
  },
  {
    ocrResult: "COMISIONADO RESIDENTE\r\nRESIDENT COMMISSIONER\r\n",
  },
  {
    ocrResult: "COMISIONADO RESIDENTE\r\nRESIDENT COMMISSIONER\r\n",
  },
  {
    ocrResult: "COMISIONADO RESIDENTE\r\nRESIDENT COMMISSIONER\r\n",
  },
  {
    ocrResult: "COMISIONADO RESIDENTE\r\nRESIDENT COMMISSIONER\r\n",
  },
  {
    ocrResult: "COMISIONADO RESIDENTE\r\nRESIDENT COMMISSIONER\r\n",
  },
  {
    ocrResult: "COMISIONADO RESIDENTE\r\nRESIDENT COMMISSIONER\r\n",
  },
]

export default function generateStateBallot(
  candidatesForGovernor,
  candidatesForResidentCommissioner
) {
  const governorByParty = groupBy(candidatesForGovernor, "2024_party")
  const residentCommissionerByParty = groupBy(
    candidatesForResidentCommissioner,
    "2024_party"
  )

  const governorRow = PoliticalParties.map((party, index) => {
    const governor = governorByParty[party]

    if (!governor) {
      return convertToOcrResult(null, 1)
    }

    return convertToOcrResult(governor[0], 1)
  })

  const residentCommissionerRow = PoliticalParties.map((party, index) => {
    const residentCommissioner = residentCommissionerByParty[party]

    if (!residentCommissioner) {
      return convertToOcrResult(null, 2)
    }

    return convertToOcrResult(residentCommissioner[0], 2)
  })

  return [
    PartiesHeader,
    GovernorsRoleHeader,
    governorRow,
    ResidentComissionerHeader,
    residentCommissionerRow,
  ]
}
