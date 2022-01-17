import { logger } from '@core/utils'
import { relanceGarantiesFinancieres } from '../../useCases'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.post(
  '/cron/relanceGarantiesFinancieres',
  asyncHandler(async (request, response) => {
    ;(await relanceGarantiesFinancieres()).match({
      ok: () => response.send('Relance envoyées avec succès'),
      err: (e: Error) => {
        logger.error(e)
        return response
          .status(500)
          .send(`Les relances n'ont pas pu être envoyées. (Erreur: ${e.message})`)
      },
    })
  })
)
