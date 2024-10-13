import Link from "./link"
import Typography from "./typography"

interface BallotInformation {
  name: string
  url: string
}

interface MunicipalityInformation extends BallotInformation {
  precincts: BallotInformation[]
}

export interface DistrictInformation extends BallotInformation {
  municipalities: MunicipalityInformation[]
}

export default function BallotsByDistrict({
  districts,
}: {
  districts: DistrictInformation[]
}) {
  return (
    <>
      {districts.map((districtSen) => (
        <div>
          <Typography tag="h3" variant="h3" className="uppercase">
            {districtSen.name}
          </Typography>
          <div className="flex flex-col justify-center gap-y-6">
            {districtSen.municipalities.map((municipality) => (
              <div>
                <Link
                  key={municipality.url}
                  to={`/papeletas/${municipality.url}`}
                  className="block my-2"
                >
                  {municipality.name}
                </Link>
                <Typography tag="p" variant="p">
                  Precintos:
                </Typography>
                <div className="flex justify-center gap-2">
                  {municipality.precincts.map((option) => (
                    <Link
                      key={option.url}
                      to={`/papeletas/${option.url}`}
                      className="my-2"
                    >
                      {option.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
