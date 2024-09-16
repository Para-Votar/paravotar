import { Button, Link, Typography } from "../../../components"

interface NoVoterIdFoundProps {
  send: any
}

export const NoVoterIdFound = ({ send }: NoVoterIdFoundProps) => {
  return (
    <div>
      <Typography tag="h2" variant="h4" className="font-bold text-red mt-1">
        Oops! No logramos encontrar tu información.
      </Typography>

      <Typography tag="p" variant="p" className="mt-4">
        Puede intentarlo nuevamente o utilizar{" "}
        <Link to="https://www.practicatuvoto.com/" target="_blank">
          Practica tu voto
        </Link>
        .
      </Typography>
      <div className="w-full my-1 mt-6">
        <Button
          className="block w-full"
          onClick={() => send("ENTER_VOTING_CENTER")}
        >
          Número de precinto
        </Button>
      </div>
    </div>
  )
}
