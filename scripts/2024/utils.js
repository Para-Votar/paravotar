export function convertToOcrResult(record, index) {
  if (!record) {
    return {
      ocrResult: "",
    }
  }

  return {
    ocrResult: `${index}. ${record["first_name"]} ${record["last_name"]}`,
    logoImg: record["picture"],
  }
}
