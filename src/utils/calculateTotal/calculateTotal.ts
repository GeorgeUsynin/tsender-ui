export const calculateTotal = (amounts: string): number => {
  const amountArray = splitStringByCommasAndNewLines(amounts).map((amt) =>
    parseFloat(amt),
  )
  if (amountArray.some(isNaN)) {
    return 0
  }
  return amountArray.reduce((acc, curr) => acc + curr, 0)
}

export const splitStringByCommasAndNewLines = (str: string) => {
  return str
    .split(/[,\n]+/)
    .map((w) => w.trim())
    .filter((w) => w !== "")
}
