import type { Request, Response } from 'express'
import { errorResponse } from './errorResponse'

export const notFoundResponse = (args: {
  response: Response
  request: Request
  ressourceTitle?: string
}) => {
  const { response, request, ressourceTitle } = args

  return errorResponse({
    request,
    response,
    customStatus: 404,
    customTitle: `${ressourceTitle || 'Ressource'} introuvable`,
    customMessage: `Merci de vérifier la barre d'adresse.`,
  })
}
