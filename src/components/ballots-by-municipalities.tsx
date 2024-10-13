import Link from "./link"
import { BallotInformation, MunicipalityInformation } from "./types"
import Typography from "./typography"

export default function BallotsByMunicipalities({
  state,
  municipalities,
}: {
  state: BallotInformation
  municipalities: MunicipalityInformation[]
}) {
  return (
    <>
      <div>
        <Typography tag="h3" variant="h3" className="uppercase">
          {state.name}
        </Typography>
        <Link to={`/papeletas/${state.url}`} className="block">
          Papeleta
        </Link>
      </div>
      {municipalities.map((municipality) => (
        <div>
          <Typography tag="h3" variant="h3" className="uppercase">
            {municipality.name}
          </Typography>
          <Link to={`/papeletas/${municipality.url}`} className="block my-2">
            Municipal
          </Link>
          {municipality.precincts.map((option) => (
            <Link
              key={option.url}
              to={`/papeletas/${option.url}`}
              className="block my-2"
            >
              {option.name}
            </Link>
          ))}
        </div>
      ))}
    </>
  )
}
