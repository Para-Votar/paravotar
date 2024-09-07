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

interface BallotConfig {
  type: BallotType
  structure: BallotStructure
}

export default function Papeleta() {
  const [ballot, setBallot] = useState<BallotConfig | null>(null)
  const params = useParams<{ id: string }>()

  useEffect(() => {
    const getBallot = async () => {
      const res = await fetch(
        `${CDN_URL}/papeletas/2024/${params.id}/data.json`
      )
      const result = await res.json()

      if (params.id === "estatal") {
        setBallot({
          type: BallotType.state,
          structure: new StateBallotConfig(result).structure,
        })
      } else if (params.id?.includes("legislativo")) {
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

  return (
    <div>
      <h1>{params.id}</h1>
      <Ballot type={ballot.type} structure={ballot.structure} votes={[]} />
    </div>
  )
}
