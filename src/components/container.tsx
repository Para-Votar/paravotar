import { ReactNode, createElement } from "react"

type Props = {
  children: ReactNode
  tag?: string
  className?: string
  tabIndex?: number
  ref?: React.RefObject<HTMLElement>
  id?: string
}

export default function Container({
  children,
  className = "",
  tag = "section",
  tabIndex,
  ref,
  id,
}: Props) {
  return createElement(
    tag,
    {
      id,
      className: `mx-auto ${className}`,
      tabIndex,
      ref,
      "data-testid": id,
    },
    children
  )
}
