import qmrMapping from "./mapping"

export default function getQmrLink(name: string) {
  const qmr = qmrMapping[name as keyof typeof qmrMapping]

  if (!qmr) {
    return null
  }

  return `https://www.quienmerepresentapr.com/search?type=todos&id=${qmr.id}&firstname=${qmr.firstName}&lastname=${qmr.lastName}&address=Puerto%20Rico`
}
