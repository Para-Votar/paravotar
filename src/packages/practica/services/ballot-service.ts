import { BallotType, Selection } from "../../../ballot-validator/types"
import { VotesCoordinates } from "../../generate-ballot/types/ballot-machine"
import {
  CandidateVoteStrategy,
  MixedVoteStrategy,
  PartyVoteStrategy,
  VoteUpdateManager,
} from "../strategies"
import { BallotResource } from "../resource"
import {
  BallotConfigByType,
  BallotConfigs,
  LegislativeBallotConfig,
  MunicipalBallotConfig,
  StateBallotConfig,
} from "./ballot-configs"
import { ElectiveField } from "./ballot-configs/base"
import { Ballots, OcrResult, PracticeContext } from "./types"
import { getExplicitlySelectedVotes, Vote } from "./vote-service"
import BallotFinder, { FindByType } from "./ballot-finder-service"

type FindByEventParams = {
  userInput: string
  findBy: FindByType
}

type VoteEvent = {
  candidate: ElectiveField
  position: VotesCoordinates
  ballotType: BallotType
}

type ExportPdfEvent = {
  ballotType: string
  ballotPath: string
}

const PARTY_ROW = 0

function findPartyVotes(votes: Vote[]) {
  return votes.filter((vote) => vote.position.row === PARTY_ROW)
}

function getBallot(ballots: Ballots, ballotType: BallotType): BallotConfigs {
  if (ballotType === BallotType.state) {
    return ballots.estatal
  } else if (ballotType === BallotType.municipality) {
    return ballots.municipal
  }

  return ballots.legislativa
}

const fetchBallotConfig = async (
  type: keyof BallotConfigByType,
  path: string
) => {
  const ballotJson: OcrResult[][] = await BallotResource.getBallot(path)

  if (type === "estatal") {
    return {
      [type]: new StateBallotConfig(ballotJson, path),
    }
  } else if (type === "municipal") {
    return {
      [type]: new MunicipalBallotConfig(ballotJson, path),
    }
  }

  return {
    [type]: new LegislativeBallotConfig(ballotJson, path),
  }
}

const BallotService = {
  async fetchBallots(
    _: PracticeContext,
    { userInput, findBy }: FindByEventParams
  ) {
    const ballotPaths = await BallotFinder(userInput, findBy)

    // Prefetch ballot data
    const ballotRequests: Promise<Partial<BallotConfigByType>>[] = [
      fetchBallotConfig("estatal", ballotPaths.estatal),
      fetchBallotConfig("municipal", ballotPaths.municipal),
      fetchBallotConfig("legislativa", ballotPaths.legislativa),
    ]
    const allBallotsJson = await Promise.all(ballotRequests)
    const ballots = allBallotsJson.reduce((prev, curr) => {
      return {
        ...prev,
        ...curr,
      }
    }, {} as BallotConfigByType)

    return {
      ballots,
      ballotPaths,
    }
  },

  updateVotes(
    context: PracticeContext,
    { candidate, position, ballotType }: VoteEvent
  ) {
    const ballots = context.ballots as Ballots
    const prevVotes = context.votes
    const existingVoteAtPosition = prevVotes.find(
      (vote) =>
        vote.position.row === position.row &&
        vote.position.column === position.column
    )

    // Remove vote or turn an implicit vote to an explicit vote.
    if (existingVoteAtPosition) {
      // Change the vote from an implicity vote to an explict one.
      if (existingVoteAtPosition.selection === Selection.selectedImplicitly) {
        return prevVotes.map((vote) => {
          if (
            vote.position.row === position.row &&
            vote.position.column === position.column
          ) {
            return new Vote(vote.position, Selection.selected, vote.candidate)
          }

          return vote
        })
      }
    }

    const isPartyVote = position.row === PARTY_ROW
    const ballot = getBallot(ballots, ballotType)
    const intendedVote = {
      candidate,
      position,
      ballotType,
      ballot,
    }

    if (isPartyVote) {
      const strategy = new PartyVoteStrategy()
      const partyVoteUpdateManager = new VoteUpdateManager(strategy)

      if (existingVoteAtPosition) {
        return partyVoteUpdateManager.remove(intendedVote, prevVotes)
      }

      return partyVoteUpdateManager.add(intendedVote, prevVotes)
    }

    const partyVotes = findPartyVotes(prevVotes)
    const hasVotesForParty = partyVotes.length >= 1

    if (hasVotesForParty) {
      const strategy = new MixedVoteStrategy()
      const mixedVoteStrategyUpdateManager = new VoteUpdateManager(strategy)

      if (existingVoteAtPosition) {
        return mixedVoteStrategyUpdateManager.remove(intendedVote, prevVotes)
      }

      return mixedVoteStrategyUpdateManager.add(intendedVote, prevVotes)
    }

    const strategy = new CandidateVoteStrategy()
    const candidateVoteStrategyManager = new VoteUpdateManager(strategy)

    if (existingVoteAtPosition) {
      return candidateVoteStrategyManager.remove(intendedVote, prevVotes)
    }

    return candidateVoteStrategyManager.add(intendedVote, prevVotes)
  },

  async generatePdf(context: PracticeContext, event: ExportPdfEvent) {
    const voteCoordinates = getExplicitlySelectedVotes(context.votes).map(
      (vote) => {
        return {
          position: vote.position,
          candidate: vote.candidate,
        }
      }
    )
    const result = await BallotResource.createBallotPdf({
      ballotType: event.ballotType,
      ballotPath: `/${event.ballotPath.substr(0, event.ballotPath.length - 1)}`,
      votes: JSON.stringify(voteCoordinates),
    })

    return result.uuid
  },

  async getPdfUrl(context: PracticeContext) {
    const { uuid } = context

    const params = new URLSearchParams()

    params.set("uuid", uuid as string)

    const result = await BallotResource.getBallotPdf(params.toString())

    if (result == null) {
      throw new Error("Failed to get PDF URL.")
    }

    return result
  },
}

export { BallotService }
