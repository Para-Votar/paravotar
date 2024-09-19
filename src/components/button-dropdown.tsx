type Option = { value: string; name?: string };

type Props = {
  options: Array<Option>
  onSelect: (selection: string) => void
  selectedOption: string | null
}

export default function Dropdown({ options, selectedOption, onSelect }: Props) {
  return (
    <div>
      <select
        className="w-full p-2 border border-primary rounded"
        onChange={(option) => {
          onSelect(option.currentTarget.value)
        }}
        value={selectedOption || ""}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name ? option.name : option.value}
          </option>
        ))}
      </select>
    </div>
  )
}
