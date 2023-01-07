/** Выброс ошибки заменен на возвращение `undefined` */
export const parseJSON = (value: string) => {
  try {
    return JSON.parse(value)
  } catch {
    return undefined
  }
}
