import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
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
import { Typography } from "../components"

interface BallotConfig {
  type: BallotType
  structure: BallotStructure
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
        setBallot({
          type: BallotType.state,
          structure: new StateBallotConfig(result).structure,
        })
      } else if (params.ballotType === "legislativa") {
        setBallot({
          type: BallotType.legislative,
          structure: new LegislativeBallotConfig(result).structure,
        })
      } else {
        setBallot({
          type: BallotType.municipality,
          structure: new MunicipalBallotConfig(result).structure,
        })
      }
    }

    getBallot()
  }, [])

  if (!ballot) {
    return <div>Loading...</div>
  }

  const title = params.ballotType === "legislativa" ? `Papeleta ${params.ballotType} ${precinctMap[params.id]} ${params.id}` : `Papeleta ${params.ballotType} ${params.id || ""}`

  return (
    <div>
      <Typography tag="h2" variant="h3" className="uppercase text-center my-4">
        {title}
      </Typography>
      <Ballot type={ballot.type} structure={ballot.structure} votes={[]} />
    </div>
  )
}
