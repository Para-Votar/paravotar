import { useEffect } from "react"
import { useMachine } from "@xstate/react"

import Switch from "../components/switch"
import Case from "../components/case"
import Default from "../components/default"
import { BallotMachine } from "../packages/generate-ballot/machines/ballot-machine"
import { BallotType, Selection } from "../ballot-validator/types"
import { Ballot } from "../packages/generate-ballot/components"
import { Vote } from "../packages/practica/services/vote-service"
import { useLocation } from "react-router-dom"

export default function GenerateBallot() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const ballotType = params.get("ballotType")
  // Remove the leading slash from the ballot path
  const ballotPath = params.get("ballotPath")?.replace("/", "")
  const rawVotes = params.get("votes") || "[]"
  const votes = JSON.parse(rawVotes).map(
    (vote: Vote) =>
      new Vote(vote.position, Selection.selected, vote.candidate || undefined)
  )

  const [state, send] = useMachine(BallotMachine, {
    context: {
      type: ballotType as string,
      path: ballotPath as string,
      votes,
    },
  })

  useEffect(() => {
    send("FETCH")
  }, [send])

  if (state.matches("success") && state.context.path && state.context.ballot) {
    return (
      <div data-state="success">
        <Switch state={state}>
          <Case value={{ success: "governmental" }}>
            <Ballot
              type={BallotType.state}
              structure={state.context.ballot}
              votes={votes}
            />
          </Case>
          <Case value={{ success: "legislative" }}>
            <Ballot
              type={BallotType.legislative}
              structure={state.context.ballot}
              votes={votes}
            />
          </Case>
          <Case value={{ success: "municipal" }}>
            <Ballot
              type={BallotType.municipality}
              structure={state.context.ballot}
              votes={votes}
            />
          </Case>
          <Default>
            <div>Unknown</div>
          </Default>
        </Switch>
      </div>
    )
  }

  return (
    <Switch state={state}>
      <Case value="loading">
        <div data-state={state.value}>Loading...</div>
      </Case>
      <Case value="failure">
        <div data-state={state.value}>Failure</div>
      </Case>
      <Default>
        <div>Test</div>
      </Default>
    </Switch>
  )
}
