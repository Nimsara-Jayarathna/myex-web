import axios, { type AxiosError } from 'axios'

export interface FriendlyError {
  status?: number
  code?: string
  message: string
  detail?: string
  isNetwork?: boolean
}

const statusMessages: Record<number, { message: string; detail?: string }> = {
  401: { message: 'Session expired', detail: 'Please sign in again to continue.' },
  403: { message: 'Access denied', detail: 'You do not have permission to perform this action.' },
  404: { message: 'Not found', detail: 'The requested resource could not be found.' },
  422: { message: 'Check your input', detail: 'Some fields look invalid. Please review and try again.' },
  500: { message: 'Server error', detail: 'Something went wrong on the server. Please try again shortly.' },
}

const extractDetail = (error: AxiosError) => {
  const data = error.response?.data as Record<string, unknown> | undefined
  if (!data) return undefined
  const detail = (data.message as string) ?? (data.error as string) ?? (data.details as string)
  return detail
}

const friendlyFromAxios = (error: AxiosError): FriendlyError => {
  const status = error.response?.status
  const code = (error.response?.data as { code?: string })?.code ?? error.code
  const isNetwork = error.code === 'ERR_NETWORK' || status === undefined

  if (isNetwork) {
    return {
      status,
      code,
      isNetwork: true,
      message: 'Network issue',
      detail: 'Check your connection and try again.',
    }
  }

  const preset = status ? statusMessages[status] : undefined
  const detail = extractDetail(error)

  return {
    status,
    code,
    message: preset?.message ?? 'Something went wrong',
    detail: detail ?? preset?.detail ?? error.message,
    isNetwork: false,
  }
}

export const mapApiError = (error: unknown): FriendlyError => {
  if (axios.isAxiosError(error)) {
    return friendlyFromAxios(error)
  }

  if (error instanceof Error) {
    return { message: error.message, detail: error.stack }
  }

  return {
    message: 'Something went wrong',
  }
}
