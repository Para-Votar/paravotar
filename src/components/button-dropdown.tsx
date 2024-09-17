import { useState } from "react"

type Option = { value: string; name?: string };

type Props = {
  options: Array<Option>
  onSelect: (selection: string) => void
  selectedOption: string | null
  isSearchEnabled?: boolean
}

export default function Dropdown({ options, selectedOption, onSelect, isSearchEnabled }: Props) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOptions: Option[] = options.filter(
    (option) =>
      option.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <div>
      {isSearchEnabled ? <input
        type="text"
        placeholder="Escribe para filtrar las opciones..."
        className="w-full p-2 mb-2 border border-primary rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      /> : null}
      <select
        className="w-full p-2 border border-primary rounded"
        onChange={(option) => {
          onSelect(option.currentTarget.value)
        }}
        value={selectedOption || ""}
      >
        {filteredOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name ? option.name : option.value}
          </option>
        ))}
      </select>
    </div>
  )
}
