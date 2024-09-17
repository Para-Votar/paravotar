import { Button, Typography, Link } from "../../../components"

type BallotFinderPickerProps = {
  selectVoterId: () => void
  selectPrecint: () => void
}

export default function BallotFinderPicker(props: BallotFinderPickerProps) {
  return (
    <div className="mx-auto mt-8 w-full lg:w-3/4">
      <Typography tag="p" variant="h3" className="uppercase">
        Busquemos tus papeletas
      </Typography>
      <div className="w-full my-6">
        <Button
          className="block w-full"
          onClick={props.selectPrecint}
          data-testid="find-by-precint"
        >
          Número de precinto o pueblo
        </Button>
      </div>
      <Typography className="mt-4" tag="p" variant="p">
        Si su pueblo tiene más de un precinto y usted no conoce a cuál precinto
        pertenece puede ir a{" "}
        <Link to="https://consulta.ceepur.org/" target="_blank">
          Consulta CEE
        </Link>
        , entrar su número electoral, presionar el botón de buscar y usar el
        número que aparece en el encasillado de Precinto.
      </Typography>
    </div>
  )
}
