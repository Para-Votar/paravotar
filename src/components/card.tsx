import { ReactNode, forwardRef, Ref } from "react"

export type CardRef = HTMLDivElement
type Props = {
  id?: string
  tabIndex?: number
  className?: string
  children: ReactNode
  applyContainerPadding?: boolean
}

export default forwardRef<CardRef, Props>(
  (
    {
      id = "",
      className = "",
      tabIndex = 0,
      children,
      applyContainerPadding = true,
    }: Props,
    ref: Ref<CardRef>
  ) => (
    <div
      id={id}
      className={`flex flex-col flex-shrink-0 justify-start w-full rounded shadow-md bg-white mx-0 relative lg:flex-1 ${className} ${
        applyContainerPadding ? "py-12 px-4 sm:px-8" : ""
      }`}
      tabIndex={tabIndex}
      ref={ref}
      data-testid={id}
    >
      {children}
    </div>
  )
)
