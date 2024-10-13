export interface BallotInformation {
  name: string
  url: string
}

export interface MunicipalityInformation extends BallotInformation {
  precincts: BallotInformation[]
}

export interface DistrictInformation extends BallotInformation {
  municipalities: MunicipalityInformation[]
}
