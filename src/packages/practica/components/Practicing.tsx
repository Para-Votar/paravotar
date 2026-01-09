import { useTour } from "@reactour/tour"

import { ColumnHighlightProvider } from "../../../context/column-highlight-context"
import { Button, Typography } from "../../../components/index"
import { BallotType } from "../../../ballot-validator/types"
import { Ballot } from "../../generate-ballot/components"
import useErrorMessages from "../hooks/use-error-messages"
import BallotContainer from "./ballot-container"

interface PracticingProps {
  state: any
  send: any
  handleSubmit: VoidFunction
}

export const Practicing = ({ state, send, handleSubmit: _handleSubmit }: PracticingProps) => {
  const { setIsOpen } = useTour()
  const { setIsPristine } = useErrorMessages(state, [
    state,
    state.value,
    state.context.votes,
    state.context.ballots?.estatal,
    state.context.ballots?.legislativa,
    state.context.ballots?.municipal,
  ])

  if (state.context.ballots == null) return

  return (
    <div>
      <ColumnHighlightProvider>
        <div className="pt-16 px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-2 mx-auto mt-2 lg:grid-cols-2">
            <Button variant="primary" onClick={() => setIsOpen(true)}>
              Ver límite de votos por puestos electivos
            </Button>
            <Button variant="inverse" onClick={() => send("BACK")}>
              Escoger papeletas
            </Button>
          </div>
          <Typography tag="p" variant="p" className="text-xs italic mt-8">
            *Para ver otros partidos desliza hacia la derecha y para ver más
            candidatos desliza hacia abajo.
          </Typography>
        </div>
        {state.context.ballotType === BallotType.state &&
          state.context.ballots.estatal && (
            <BallotContainer>
              <Ballot
                type={BallotType.state}
                structure={state.context.ballots.estatal.structure}
                votes={state.context.votes}
                toggleVote={(candidate, position) => {
                  send("SELECTED_ELECTIVE_FIELD", {
                    candidate,
                    position,
                    ballotType: BallotType.state,
                  })
                  setIsPristine(false)
                }}
              />
            </BallotContainer>
          )}
        {state.context.ballotType === BallotType.legislative &&
          state.context.ballots.legislativa && (
            <BallotContainer>
              <Ballot
                type={BallotType.legislative}
                structure={state.context.ballots.legislativa.structure}
                votes={state.context.votes}
                toggleVote={(candidate, position) => {
                  send("SELECTED_ELECTIVE_FIELD", {
                    candidate,
                    position,
                    ballotType: BallotType.legislative,
                  })
                  setIsPristine(false)
                }}
              />
            </BallotContainer>
          )}
        {state.context.ballotType === BallotType.municipality &&
          state.context.ballots.municipal && (
            <BallotContainer>
              <Ballot
                type={BallotType.municipality}
                structure={state.context.ballots.municipal.structure}
                votes={state.context.votes}
                toggleVote={(candidate, position) => {
                  send("SELECTED_ELECTIVE_FIELD", {
                    candidate,
                    position,
                    ballotType: BallotType.municipality,
                  })
                  setIsPristine(false)
                }}
              />
            </BallotContainer>
          )}
      </ColumnHighlightProvider>
    </div>
  )
}
