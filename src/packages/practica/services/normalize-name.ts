const charsMap: Record<string, string> = {
  á: "a",
  é: "e",
  í: "i",
  ó: "o",
  ú: "u",
  ñ: "n",
  ü: "u",
}

export default function getNormalizedName(name: string) {
  const cleanedMunicipality = name
    .trim()
    .toLowerCase()
    .replace(" ", "-")
    .split("")
    .map((char) => charsMap[char] ?? char)
    .join("")

  return cleanedMunicipality
}
