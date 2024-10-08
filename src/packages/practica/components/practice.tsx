import { useEffect, useMemo } from "react"
import _ from "lodash"

import { useMachine } from "@xstate/react"
import { ToastContainer } from "react-toastify"
import { useTranslation } from "react-i18next"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"

import { Card, Link, Spinner, Typography } from "../../../components/index"
import { BallotType } from "../../../ballot-validator/types"
import Arrows from "../../../components/arrows"
import Default from "../../../components/default"
import Switch from "../../../components/switch"
import Case from "../../../components/case"
import {
  BallotConfigs,
  StateVotesCount,
  MunicipalVotesCount,
  LegislativeVotesCount,
} from "../services/ballot-configs"
// import useBallotValidation from "../hooks/use-ballot-validation"
import useVotesTransform from "../hooks/use-votes-transform"
import { BallotSelectionEvent, PracticeMachine } from "../machines/practice"
import useVotesCount from "../hooks/use-votes-count"
import { Vote } from "../services/vote-service"
import BallotFinderPicker from "./ballot-finder-picker"
import PrecintNumberForm from "./precint-number-form"

import { Results } from "./Results"
import BallotStatus from "./ballot-status"
import { Practicing } from "./Practicing"
import ResultsState from "./results-state"
import ResultsMunicipal from "./results-municipal"
import ResultsLegislative from "./results-legislative"
import BallotSelector from "./ballot-selector"
import Steps from "./steps"
import ContinuePracticing from "./continue-practicing"
import { FindByType } from "../services/ballot-finder-service"
import "react-toastify/dist/ReactToastify.css"
import { TourProvider } from "@reactour/tour"
import { Tours } from "../constants"
import useScrollIntoView from "../../../hooks/useScrollIntoView"
import useBallotValidateAndSubmit from "../hooks/use-ballot-validate-and-submit"

const disableBody = (target: Element | null) => {
  if (document == null || target == null) return

  disableBodyScroll(target)

  const mainContainer: HTMLElement | null =
    document.querySelector("#main-container")

  if (mainContainer) {
    mainContainer.style.overflowY = "hidden"
    mainContainer.style.overflowX = "hidden"
  }

  const ballotContainer: HTMLElement | null =
    document.querySelector("#ballot-container")

  if (ballotContainer) {
    ballotContainer.style.overflowY = "hidden"
    ballotContainer.style.overflowX = "hidden"
  }

  const htmlContainer: HTMLElement | null = document.querySelector("html")

  if (htmlContainer) {
    htmlContainer.style.scrollBehavior = "auto"
  }
}

const enableBody = (target: Element | null) => {
  if (document == null || target == null) return

  enableBodyScroll(target)

  const mainContainer: HTMLElement | null =
    document.querySelector("#main-container")

  if (mainContainer) {
    mainContainer.style.overflowY = "scroll"
    mainContainer.style.overflowX = "autoscroll-behavior: smooth;"
  }

  const ballotContainer: HTMLElement | null =
    document.querySelector("#ballot-container")

  if (ballotContainer) {
    ballotContainer.style.overflowY = "hidden"
    ballotContainer.style.overflowX = "scroll"
  }

  const htmlContainer: HTMLElement | null = document.querySelector("html")

  if (htmlContainer) {
    htmlContainer.style.scrollBehavior = "smooth"
  }
}

export default function Practice({
  initialPrecint,
  initialBallotType,
}: {
  initialPrecint: string | null
  initialBallotType?: BallotType
}) {
  const { t } = useTranslation()
  const [state, send] = useMachine(PracticeMachine, {
    context: {
      ballotType: initialBallotType,
    },
  })

  useEffect(() => {
    send("start", { userInput: initialPrecint, findBy: FindByType.precint })
  }, [])

  const votes = state.context.votes
  const transformedVotes = useVotesTransform(votes, state)
  // const { ballotStatus, setBallotStatus } = useBallotValidation(
  //   transformedVotes
  // )
  const { votesCount, setVotesCount } = useVotesCount(transformedVotes)
  const onSubmit = useBallotValidateAndSubmit()

  const handleSubmit = (
    votes: Vote[],
    ballotType: BallotType,
    ballot?: BallotConfigs
  ) => {
    onSubmit(
      votes,
      ballotType,
      () => {
        send("SUBMIT")
      },
      ballot
    )
  }

  const selectBallot = (
    selectedBallot: BallotSelectionEvent["type"],
    eventData: any
  ) => {
    // setBallotStatus(null)
    setVotesCount(null)

    send(selectedBallot, eventData)
  }

  const ballotType = state.context.ballotType || null

  const practice = useMemo(() => {
    if (state.context.ballots == null) return { tour: [], onSubmit: () => {} }

    if (
      state.context.ballotType === BallotType.state &&
      state.context.ballots.estatal
    ) {
      return {
        tour: Tours.state,
        onSubmit: () =>
          handleSubmit(
            state.context.votes,
            BallotType.state,
            state.context.ballots?.estatal
          ),
      }
    }

    if (
      state.context.ballotType === BallotType.legislative &&
      state.context.ballots.legislativa
    ) {
      return {
        tour: Tours.legislative,
        onSubmit: () =>
          handleSubmit(
            state.context.votes,
            BallotType.legislative,
            state.context.ballots?.legislativa
          ),
      }
    }

    return {
      tour: Tours.municipal,
      onSubmit: () =>
        handleSubmit(
          state.context.votes,
          BallotType.municipality,
          state.context.ballots?.municipal
        ),
    }
  }, [
    handleSubmit,
    state.context.ballotType,
    state.context.ballots,
    state.context.votes,
  ])

  useScrollIntoView()

  return (
    <div className="relative w-full">
      <div className="lg:w-3/4 m-auto">
        <Typography tag="h2" variant="h3" className="uppercase">
          Practica tu voto
        </Typography>
        <Typography
          tag="p"
          variant="p"
          weight="base"
          className="font-normal mt-4"
        >
          Si es tu primera vez votando o no conoces los tipos de votos que
          puedes emitir, te recomendamos que visites la sección de{" "}
          <Link to="/haz-que-tu-voto-cuente">¿Cómo votar?</Link> antes de
          practicar tu voto.
        </Typography>
      </div>
      <Card
        className="practice-card flex justify-center mt-8"
        applyContainerPadding={!state.matches("practicing")}
      >
        {state.nextEvents.includes("BACK") && (
          <div
            className={`absolute top-0 -ml-1 pt-4 ${
              state.matches("practicing") ? "px-4 sm:px-8" : ""
            }`}
          >
            <button
              className="mb-4 inline-flex items-center border-none text-primary font-semibold hover:underline"
              onClick={() => send("BACK")}
            >
              <Arrows
                className="text-primary block mr-2 hover:text-white"
                style={{ transform: "rotate(90deg)" }}
              />
              Volver
            </button>
          </div>
        )}
        <Switch state={state}>
          <Case value="mainScreen">
            <Steps onStart={() => send("START_PRACTICE")} />
          </Case>
          <Case value="ballotFinderPicker">
            <BallotFinderPicker
              selectVoterId={() => send("SELECTED_VOTER_ID")}
              selectPrecint={() => send("SELECTED_PRECINT")}
            />
          </Case>
          <Case value="enterPrecint">
            <PrecintNumberForm
              errorMessage={
                state.matches({ enterPrecint: "empty" })
                  ? "Favor un número de precinto."
                  : state.matches({ enterPrecint: "invalidLength" })
                    ? "Su precinto debe tener 3 caracteres o menos."
                    : null
              }
              onSubmit={({ userInput, findBy }) =>
                send("ADDED_PRECINT", {
                  userInput,
                  findBy,
                })
              }
            />
          </Case>
          <Case value="fetchBallots">
            <div>
              <Spinner className="mx-auto" />
              <Typography variant="p" tag="p" className="block mt-4">
                Cargando...
              </Typography>
            </div>
          </Case>
          <Case value="selectBallot">
            <BallotSelector
              selectState={() =>
                selectBallot("SELECTED_GOVERNMENTAL", {
                  ballotType: BallotType.state,
                })
              }
              selectMunicipal={() =>
                selectBallot("SELECTED_MUNICIPAL", {
                  ballotType: BallotType.municipality,
                })
              }
              selectLegislative={() =>
                selectBallot("SELECTED_LEGISLATIVE", {
                  ballotType: BallotType.legislative,
                })
              }
            />
          </Case>
          <Case value="practicing">
            <TourProvider
              steps={practice.tour}
              afterOpen={disableBody}
              beforeClose={enableBody}
              onClickClose={({ setIsOpen }) => {
                setIsOpen(false)
              }}
              inViewThreshold={64}
              showCloseButton
            >
              <Practicing
                state={state}
                send={send}
                handleSubmit={practice.onSubmit}
              />
            </TourProvider>
          </Case>
          <Case value="showResults">
            <Results state={state} send={send} />
          </Case>
          <Case value="continuePracticing">
            <ContinuePracticing send={send} />
          </Case>
          <Default>
            <>FAILURE</>
          </Default>
        </Switch>
      </Card>
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
      {votesCount && state.matches("practicing") && (
        <BallotStatus onSubmit={practice.onSubmit}>
          {ballotType === BallotType.state ? (
            <ResultsState
              votesCount={votesCount as StateVotesCount}
              votes={votes}
            />
          ) : ballotType === BallotType.municipality ? (
            <ResultsMunicipal
              votesCount={votesCount as MunicipalVotesCount}
              votes={votes}
            />
          ) : ballotType === BallotType.legislative ? (
            <ResultsLegislative
              votesCount={votesCount as LegislativeVotesCount}
              votes={votes}
            />
          ) : null}
        </BallotStatus>
      )}
    </div>
  )
}
