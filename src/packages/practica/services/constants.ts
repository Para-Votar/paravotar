export const baseUrl =
  "https://9siy3jjb1g.execute-api.us-east-1.amazonaws.com/dev"

export enum APIPaths {
  GET_VOTER_DETAILS = "/voterStatus",
}

export const API_URL =
  "https://9siy3jjb1g.execute-api.us-east-1.amazonaws.com/dev"
export const PUBLIC_S3_BUCKET = "https://paravotar.s3.amazonaws.com"
export const CDN_URL = "https://cdn.paravotar.org"

export enum BALLOT_SECTION_TITLES {
  GOBERNADOR = "GOBERNADOR",
  COMISIONADO_RESIDENTE = "COMISIONADO RESIDENTE",
  ALCALDE = "ALCALDE",
  LEGISLADORES_MUNICIPALES = "LEGISLADORES MUNICIPALES",
  REPRESENTANTES_POR_DISTRITO = "REPRESENTANTES POR DISTRITO",
  SENADORES_POR_DISTRITO = "SENADORES POR DISTRITO",
  REPRESENTANTES_POR_ACUMULACION = "REPRESENTANTES POR ACUMULACION",
  SENADORES_POR_ACUMULACION = "SENADORES POR ACUMULACION",
}

export const BALLOT_SECTION_TITLES_LIST = Object.values(BALLOT_SECTION_TITLES)

export const MAX_PRECINT_LENGTH = 3
export const PARTY_ROW = 0

export const towns = [
  "Adjuntas",
  "Aguada",
  "Aguadilla",
  "Aguas Buenas",
  "Aibonito",
  "Arecibo",
  "Arroyo",
  "Añasco",
  "Barceloneta",
  "Barranquitas",
  "Bayamón",
  "Cabo Rojo",
  "Caguas",
  "Camuy",
  "Canóvanas",
  "Carolina",
  "Cataño",
  "Cayey",
  "Ceiba",
  "Ciales",
  "Cidra",
  "Coamo",
  "Comerío",
  "Corozal",
  "Culebra",
  "Dorado",
  "Fajardo",
  "Florida",
  "Guayama",
  "Guayanilla",
  "Guaynabo",
  "Gurabo",
  "Guánica",
  "Hatillo",
  "Hormigueros",
  "Humacao",
  "Isabela",
  "Jayuya",
  "Juana Díaz",
  "Juncos",
  "Lajas",
  "Lares",
  "Las Marías",
  "Las Piedras",
  "Loiza",
  "Luquillo",
  "Manatí",
  "Maricao",
  "Maunabo",
  "Mayagüez",
  "Moca",
  "Morovis",
  "Naguabo",
  "Naranjito",
  "Orocovis",
  "Patillas",
  "Peñuelas",
  "Ponce",
  "Quebradillas",
  "Rincón",
  "Rio Grande",
  "Sabana Grande",
  "Salinas",
  "San Germán",
  "San Juan",
  "San Lorenzo",
  "San Sebastián",
  "Santa Isabel",
  "Toa Alta",
  "Toa Baja",
  "Trujillo Alto",
  "Utuado",
  "Vega Alta",
  "Vega Baja",
  "Vieques",
  "Villalba",
  "Yabucoa",
  "Yauco",
]
