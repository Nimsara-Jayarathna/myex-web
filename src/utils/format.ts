import dayjs from 'dayjs'

export const formatCurrency = (value: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)

export const formatDate = (value: string) => dayjs(value).format('MMM D, YYYY')

export const formatShortDate = (value: string) => dayjs(value).format('MMM D')
