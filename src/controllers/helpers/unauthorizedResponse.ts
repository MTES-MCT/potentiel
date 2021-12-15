import type { Request, Response } from 'express'
import { errorResponse } from './errorResponse'

export const unauthorizedResponse = (args: {
  response: Response
  request: Request
  customTitle?: string
  customMessage?: string
}) => {
  const { response, request, customMessage, customTitle } = args

  return errorResponse({
    request,
    response,
    customStatus: 404,
    customTitle: customTitle || 'Accès restreint',
    customMessage: customMessage || `Votre compte ne permet pas d'accèder à cette ressource.`,
  })
}
