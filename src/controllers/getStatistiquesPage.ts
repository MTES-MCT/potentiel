import { getStats } from '../config'
import { Success, SystemError } from '../helpers/responses'
import { HttpRequest } from '../types'
import { StatistiquesPage } from '../views/pages'

const getStatistiquesPage = async (request: HttpRequest) => {
  const statsResult = await getStats()

  if (statsResult.isErr())
    return SystemError('Les statistiques ne sont pas disponibles pour le moment.')

  return Success(
    StatistiquesPage({
      request,
      ...statsResult.value,
    })
  )
}
export { getStatistiquesPage }
