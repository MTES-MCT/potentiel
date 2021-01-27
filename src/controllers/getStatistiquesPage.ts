import { getStats } from '../config'
import { logger } from '../core/utils'
import routes from '../routes'
import { StatistiquesPage } from '../views/pages'
import { v1Router } from './v1Router'

v1Router.get(routes.STATS, async (request, response) => {
  await getStats().match(
    (stats) => {
      response.send(
        StatistiquesPage({
          request,
          ...stats,
        })
      )
    },
    (e) => {
      logger.error(e)
      response.status(500).send('Les statistiques ne sont pas disponibles pour le moment.')
    }
  )
})
