import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { CDN_URL } from "../packages/generate-ballot/constants"
import { Ballot } from "../packages/generate-ballot/components"
import { BallotType } from "../ballot-validator/types"
import {
  LegislativeBallotConfig,
  MunicipalBallotConfig,
  StateBallotConfig,
} from "../packages/practica/services/ballot-configs"
import { BallotStructure } from "../packages/practica/services/ballot-configs/types"
import { precinctMap } from "../packages/practica/constants"
import getNormalizedName from "../packages/practica/services/normalize-name"
import { Container, Layout, Typography } from "../components"
import { useMachine } from "@xstate/react"
import { PracticeMachine } from "../packages/practica/machines/practice"
import useErrorMessages from "../packages/practica/hooks/use-error-messages"

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

  useEffect(() => {
    const getBallot = async () => {
      const ballotId = getBallotId(params.id, params.ballotType)
      const res = await fetch(`${CDN_URL}/papeletas/2024/${ballotId}/data.json`)
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
  }, [])

  if (!ballot) {
    return <div>Loading...</div>
  }

  return (
    <InteractiveBallot
      ballot={ballot}
      ballotType={params.ballotType || "municipal"}
      precintId={params.id}
    />
  )
}

function InteractiveBallot(props: {
  ballot: BallotConfig
  ballotType: string
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
        estatal: ballot.config,
        legislativa: ballot.config,
        municipal: ballot.config,
      },
      userInput: params.id || "004",
    },
  })

  console.log('state', state.toJSON());

  useEffect(() => {
    send({ type: "SKIP_TO_PRACTICE" })
    return
  }, [])

  const { setIsPristine } = useErrorMessages(state as any, [
    state,
    state.value,
    state.context.votes,
    state.context.ballots?.estatal,
    state.context.ballots?.legislativa,
    state.context.ballots?.municipal,
  ])

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
        <div className="w-full overflow-x-auto">
          <div className="scale-86 origin-top-left">
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
          </div>
        </div>
      </Container>
    </Layout>
  )
}
