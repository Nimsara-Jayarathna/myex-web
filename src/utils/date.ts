export const formatDateInTimeZone = (date: Date, timeZone: string): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export const isTodayInUserTimeZone = (dateISO: string, explicitTimeZone?: string): boolean => {
  const timeZone = explicitTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone

  if (!timeZone) {
    return false
  }

  const transactionInstant = new Date(dateISO)
  const now = new Date()

  const txLocalDay = formatDateInTimeZone(transactionInstant, timeZone)
  const nowLocalDay = formatDateInTimeZone(now, timeZone)

  return txLocalDay === nowLocalDay
}

