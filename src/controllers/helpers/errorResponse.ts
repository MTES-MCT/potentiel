import type { Request, Response } from 'express'
import { ErrorPage } from '@views'

export const errorResponse = (args: {
  response: Response
  request: Request
  customStatus?: number
  customTitle?: string
  customMessage?: string
}) => {
  const { response, request, customTitle, customMessage, customStatus } = args
  return response.status(customStatus || 500).send(
    ErrorPage({
      request,
      errorTitle: customTitle || 'Erreur',
      errorMessage:
        customMessage ||
        'Une erreur est survenue. Merci de réessayer ou de contacter un administrateur.',
    })
  )
}
