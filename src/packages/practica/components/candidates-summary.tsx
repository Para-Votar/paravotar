import { PropsWithChildren, ReactNode } from "react"

import { Typography } from "../../../components"
import Avatar from "../../../assets/images/avatar.svg?url"

const QUIEN_ME_REPRESENTA = "https://www.quienmerepresentapr.com/search"

function getProfileLink(name: string) {
  const params = new URLSearchParams()
  const splittedName = name.split(" ")
  const firstName =
    splittedName.length === 2
      ? `${splittedName[0]}`
      : `${splittedName[0]} ${splittedName[1]}`
  const lastName =
    splittedName.length === 2
      ? `${splittedName[1]}`
      : `${splittedName[2]} ${splittedName[3]}`

  // https://www.quienmerepresentapr.com/search?type=todos&id=0&firstname=Jos%C3%A9%20Bernardo&lastname=Jos%C3%A9%20Bernardo&address=Puerto%20Rico

  params.set("type", "todos")
  params.set("id", "0")
  params.set("address", "Puerto Rico")
  params.set("firstname", firstName)
  params.set("lastname", lastName)

  return `${QUIEN_ME_REPRESENTA}?${params.toString()}`
}

type CandidateProps = {
  name: string
  img?: string
}

function CandidateCard(props: CandidateProps) {
  const link = getProfileLink(props.name)

  console.log({ link })

  return (
    <div className="flex items-center px-4 py-2 shadow-md bg-white rounded">
      <>
        <img className="h-12 w-12" src={props.img || Avatar} alt="" />
        <Typography
          variant="p"
          tag="p"
          className="font-semibold ml-2 text-left"
        >
          {props.name}
        </Typography>
        <a href={link} target="_blank" rel="noreferrer">
          Más información
        </a>
      </>
    </div>
  )
}

function CandidatesSummarySection(props: {
  children: ReactNode
  inverse: boolean
  className?: string
}) {
  return (
    <div
      className={`border border-r-0 border-l-0 border-t-0 mb-4 ${
        props.inverse ? "" : "border-white"
      } ${props.className}`}
    >
      <Typography
        tag="p"
        variant="p"
        className={`${
          props.inverse ? "" : "text-white"
        } text-left mb-2 font-bold`}
      >
        {props.children}
      </Typography>
    </div>
  )
}

function CandidatesSummary({ children }: PropsWithChildren<{}>) {
  if (children == null) {
    return (
      <div className="grid lg:grid-cols-3 gap-2">
        <div className="flex items-center px-4 py-2 shadow-md bg-white rounded col-span-3">
          <Typography tag="p" variant="p" className="text-center">
            No haz seleccionado un candidato.
          </Typography>
        </div>
      </div>
    )
  }

  return <div className="grid lg:grid-cols-3 gap-2">{children}</div>
}

CandidatesSummary.Section = CandidatesSummarySection
CandidatesSummary.Card = CandidateCard

export default CandidatesSummary
