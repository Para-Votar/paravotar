import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

import { toFriendlyErrorMessages } from "../../../ballot-validator/helpers/messages"
import { BallotType } from "../../../ballot-validator/types"
import coordinatesToSections from "../services/coordinates-to-sections"
import { getExplicitlySelectedVotes, Vote } from "../services/vote-service"
import {
  BallotConfigs,
  MunicipalBallotConfig,
} from "../services/ballot-configs"
import BallotValidator from "../../../ballot-validator/index"
import { isEmpty } from "lodash"

export default function useBallotValidateAndSubmit() {
  const { t } = useTranslation()

  const onSubmit = (
    votes: Vote[],
    ballotType: BallotType,
    onSuccess: () => void,
    ballot?: BallotConfigs
  ) => {
    if (ballot == null) return

    const cleanedVotes = getExplicitlySelectedVotes(votes)
    const transformedVotes = coordinatesToSections(
      cleanedVotes,
      ballot,
      ballotType
    )

    const validationResult = BallotValidator(transformedVotes, ballotType)

    toast.dismiss()

    const writeInMissingNames = votes
      .map((v) => {
        if (v.candidate && isEmpty(v.candidate.name)) {
          return v
        }
        return null
      })
      .filter((v) => v !== null)

    if (
      validationResult.outcomes.denied.length === 0 &&
      writeInMissingNames.length === 0
    ) {
      onSuccess()
      return
    }

    toFriendlyErrorMessages(validationResult)?.map((messageId) => {
      if (
        messageId.includes("MunicipalLegislatorDynamicSelectionRule") &&
        ballotType === BallotType.municipality
      ) {
        toast.error(
          t(messageId, {
            maxSelection: (ballot as MunicipalBallotConfig)
              ?.amountOfMunicipalLegislators,
          })
        )
      } else {
        toast.error(t(messageId))
      }
    })

    if (writeInMissingNames.length > 0) {
      toast.error(
        "El nombre del candidato por nominación directa no puede estar vacio"
      )
    }
  }

  return onSubmit
}
