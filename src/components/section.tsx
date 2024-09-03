import { Link } from "react-router-dom"

type SubSectionProps = {
  name: string
  route: string
  isActive: boolean
  onClick?: () => void
}

export function Section(props: SubSectionProps) {
  return (
    <li
      className={`px-4 hover:bg-primary hover:text-white ${
        props.isActive ? "bg-primary text-white" : ""
      }`}
    >
      {URL.canParse(props.route) ? (
        <a
          className="py-1 block w-full text-sm"
          href={props.route}
          target="_blank"
        >
          {props.name}
        </a>
      ) : (
        <Link
          className="py-1 block w-full text-sm"
          to={props.route}
          onClick={props.onClick ? props.onClick : undefined}
        >
          {props.name}
        </Link>
      )}
    </li>
  )
}
