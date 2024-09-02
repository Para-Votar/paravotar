import { useEffect } from "react"
import { Location } from "react-router-dom"

export default function useScrollIntoView(location?: Location) {
  useEffect(() => {
    if (document == null) return

    let element = location
      ? document.querySelector(location.hash)
      : document.querySelector("body")

    if (element == null) return

    element.scrollIntoView()
  }, [location])
}
