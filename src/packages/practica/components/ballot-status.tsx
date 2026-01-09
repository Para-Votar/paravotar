import { ReactNode, useState } from "react"

import Arrows from "../../../components/arrows"
import { Button } from "../../../components"

type BallotStatusType = {
  children: ReactNode
  onSubmit?: () => void
}

export default function BallotStatus({ children, onSubmit }: BallotStatusType) {
  const [showFullscreen, setShowFullscreen] = useState(false)

  if (showFullscreen) {
    return (
      <div className="fixed bottom-0 left-0 bg-primary w-full h-screen pt-16 lg:pt-20">
        <div className="flex flex-col">
          <div className="w-11/12  mx-auto py-4 overflow-y-auto ballot-summary">
            {children}
            <button
              className="flex items-center text-white mt-12 px-4 py-2 border border-white rounded mx-auto"
              onClick={() => setShowFullscreen(false)}
            >
              Ocultar
              <Arrows
                className="ml-4 text-white"
                style={{ transform: "rotate(0deg)" }}
              />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 bg-navbar p-2 text-left w-full shadow">
      <div className="flex space-between">
        <Button variant="inverse" onClick={() => setShowFullscreen(true)}>
          Ver candidatos seleccionados
        </Button>
        <div className="flex flex-1" />
        <Button onClick={onSubmit} data-testid="submit">Validar</Button>
      </div>
    </div>
  )
}
