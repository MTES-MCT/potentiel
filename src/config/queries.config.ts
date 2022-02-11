import { appelsOffreStatic } from '@dataAccess/inMemory'
import { makeGetProjectAppelOffre } from '@modules/projectAppelOffre'

const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)
export { getProjectAppelOffre }

export { isPeriodeLegacy } from '@dataAccess/inMemory'
export * from '@infra/sequelize/queries'
