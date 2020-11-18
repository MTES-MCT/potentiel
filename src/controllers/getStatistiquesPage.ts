import { getStats } from '../config'
import { Success, SystemError } from '../helpers/responses'
import { HttpRequest } from '../types'
import { StatistiquesPage } from '../views/pages'

const getStatistiquesPage = async (request: HttpRequest) => {
  const stats = await getStats()

  if (!stats) return SystemError('Les statistiques ne sont pas disponibles pour le moment.')

  return Success(
    StatistiquesPage({
      request,
      ...stats,
    })
  )
}
export { getStatistiquesPage }
