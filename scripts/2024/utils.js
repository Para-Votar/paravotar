export function convertToOcrResult(record, index) {
  if (!record) {
    return {
      ocrResult: "",
    }
  }

  const picturePath = record["picture"].split("/")
  const candidateImg = picturePath[picturePath.length - 1]

  return {
    ocrResult: `${index}. ${record["first_name"]} ${record["last_name"]}`,
    logoImg: candidateImg,
  }
}
