let counter = 0

export const generateId = (length: number = 2) => {
  return Math.random().toString(36).substring(2, length + 2) + counter++
}
