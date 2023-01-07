/** Приводит секунды к привычному формату отображения времени */
export const formatSeconds = (seconds: number): string => {
  if (seconds < 0) {
    throw new Error('Секунды должны быть положительным числом.')
  }

  if (seconds >= 3600) {
    const hours = Math.trunc(seconds / 3600)
    const minutes = Math.trunc((seconds - hours * 3600) / 60)
    if (minutes) {
      return `${hours} ч ${minutes} мин`
    }
    return `${hours} ч`
  }

  if (seconds >= 60) {
    const minutes = Math.trunc(seconds / 60)
    const trueSeconds = Math.trunc(seconds - minutes * 60)
    if (trueSeconds) {
      return `${minutes} мин ${trueSeconds} сек`
    }
    return `${minutes} мин`
  }

  return `${seconds} сек`
}
