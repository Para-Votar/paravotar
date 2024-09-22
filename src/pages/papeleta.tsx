import { useEffect, useMemo, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { CDN_URL } from "../packages/generate-ballot/constants"
import { Ballot } from "../packages/generate-ballot/components"
import { BallotType } from "../ballot-validator/types"
import {
  LegislativeBallotConfig,
  LegislativeVotesCount,
  MunicipalBallotConfig,
  MunicipalVotesCount,
  StateBallotConfig,
  StateVotesCount,
} from "../packages/practica/services/ballot-configs"
import { BallotStructure } from "../packages/practica/services/ballot-configs/types"
import { precinctMap } from "../packages/practica/constants"
import getNormalizedName from "../packages/practica/services/normalize-name"
import { Container, Layout, Typography } from "../components"
import { useMachine } from "@xstate/react"
import { PracticeMachine } from "../packages/practica/machines/practice"
import useErrorMessages from "../packages/practica/hooks/use-error-messages"
import BallotContainer from "../packages/practica/components/ballot-container"
import { ToastContainer } from "react-toastify"
import Switch from "../components/switch"
import Case from "../components/case"
import { Results } from "../packages/practica/components/Results"
import BallotStatus from "../packages/practica/components/ballot-status"
import ResultsState from "../packages/practica/components/results-state"
import useVotesTransform from "../packages/practica/hooks/use-votes-transform"
import useVotesCount from "../packages/practica/hooks/use-votes-count"
import ResultsMunicipal from "../packages/practica/components/results-municipal"
import ResultsLegislative from "../packages/practica/components/results-legislative"
import useBallotValidateAndSubmit from "../packages/practica/hooks/use-ballot-validate-and-submit"
import Card from "../components/card"
import { BallotsResponse } from "../packages/practica/services/types"

interface BallotConfig {
  type: BallotType
  structure: BallotStructure
  config: StateBallotConfig | LegislativeBallotConfig | MunicipalBallotConfig
}

function getBallotId(id?: string, ballotType?: string) {
  // State ballot doesn't have an id
  if (ballotType === "estatal") {
    return ballotType
  }

  if (ballotType === "legislativa") {
    const municipality = precinctMap[id]

    return `${getNormalizedName(municipality)}-legislativo-${id}`
  }

  // Municipal ballots only use the town's name.
  return id
}

export default function Papeleta() {
  const [ballot, setBallot] = useState<BallotConfig | null>(null)
  const params = useParams<{ id: string; ballotType: string }>()
  const ballotPath = useMemo(() => {
    const ballotId = getBallotId(params.id, params.ballotType)

    return `papeletas/2024/${ballotId}/`
  }, [params])

  useEffect(() => {
    const getBallot = async () => {
      const res = await fetch(`${CDN_URL}/${ballotPath}data.json`)
      const result = await res.json()

      if (params.ballotType === "estatal") {
        const config = new StateBallotConfig(result)
        setBallot({
          type: BallotType.state,
          structure: new StateBallotConfig(result).structure,
          config,
        })
      } else if (params.ballotType === "legislativa") {
        const config = new LegislativeBallotConfig(result)
        setBallot({
          type: BallotType.legislative,
          structure: new LegislativeBallotConfig(result).structure,
          config,
        })
      } else {
        const config = new MunicipalBallotConfig(result)
        setBallot({
          type: BallotType.municipality,
          structure: new MunicipalBallotConfig(result).structure,
          config,
        })
      }
    }

    getBallot()
  }, [ballotPath])

  if (!ballot) {
    return <div>Loading...</div>
  }

  return (
    <InteractiveBallot
      ballot={ballot}
      ballotType={params.ballotType || "municipal"}
      ballotPath={ballotPath}
      precintId={params.id}
    />
  )
}

function InteractiveBallot(props: {
  ballot: BallotConfig
  ballotType: string
  ballotPath: string
  precintId?: string
}) {
  const { ballot, ballotType, precintId } = props
  const location = useLocation()
  const params = useParams<{ id: string; ballotType: string }>()

  const title =
    ballotType === "legislativa"
      ? `Papeleta ${ballotType} ${precinctMap[precintId]} ${params.id}`
      : `Papeleta ${ballotType} ${params.id || ""}`

  const [state, send] = useMachine(PracticeMachine, {
    context: {
      ballotType: ballot.type,
      ballots: {
        // TODO: Pass in only the necessary ballot config
        estatal: ballot.config as StateBallotConfig,
        legislativa: ballot.config as LegislativeBallotConfig,
        municipal: ballot.config as MunicipalBallotConfig,
      },
      userInput: params.id || "004",
    },
  })

  const { setIsPristine } = useErrorMessages(state as any, [
    state,
    state.value,
    state.context.votes,
    state.context.ballots?.estatal,
    state.context.ballots?.legislativa,
    state.context.ballots?.municipal,
  ])

  const votes = state.context.votes
  const transformedVotes = useVotesTransform(votes, state)
  const { votesCount, setVotesCount } = useVotesCount(transformedVotes)
  const onSubmit = useBallotValidateAndSubmit()

  const handleSubmit = () => {
    onSubmit(
      votes,
      ballot.type,
      () => {
        send("SUBMIT")
      },
      ballot.config
    )
  }

  useEffect(() => {
    send({
      type: "SKIP_TO_PRACTICE",
      ballotType: ballot.type,
      // Assign the ballot paths so <Results /> can generate the PDF
      ballotPaths: {
        estatal: props.ballotPath,
        municipal: props.ballotPath,
        legislativa: props.ballotPath,
      },
    })
    return
  }, [])

  return (
    <Layout location={location}>
      <Container className="overflow-hidden">
        <Typography
          tag="h2"
          variant="h3"
          className="uppercase text-center my-4"
        >
          {title}
        </Typography>
        <Switch state={state}>
          <Case value="practicing">
            <BallotContainer>
              <ToastContainer
                position="top-right"
                autoClose={10000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              <Ballot
                type={ballot.type}
                structure={ballot.structure}
                votes={state.context.votes}
                toggleVote={(candidate, position) => {
                  send("SELECTED_ELECTIVE_FIELD", {
                    candidate,
                    position,
                    ballotType: ballot.type,
                  })
                  setIsPristine(false)
                }}
              />
              {votesCount && state.matches("practicing") && (
                <BallotStatus onSubmit={handleSubmit}>
                  {ballot.type === BallotType.state ? (
                    <ResultsState
                      votesCount={votesCount as StateVotesCount}
                      votes={state.context.votes}
                    />
                  ) : ballot.type === BallotType.municipality ? (
                    <ResultsMunicipal
                      votesCount={votesCount as MunicipalVotesCount}
                      votes={state.context.votes}
                    />
                  ) : ballot.type === BallotType.legislative ? (
                    <ResultsLegislative
                      votesCount={votesCount as LegislativeVotesCount}
                      votes={state.context.votes}
                    />
                  ) : null}
                </BallotStatus>
              )}
            </BallotContainer>
          </Case>
          <Case value="showResults">
            <div className="practice-container mb-16 text-center w-full mx-auto lg:pt-5">
              <Card className="practice-card flex justify-center text-center">
                <Results state={state} send={send} returnToBallotsRoute />
              </Card>
            </div>
          </Case>
        </Switch>
      </Container>
    </Layout>
  )
}
