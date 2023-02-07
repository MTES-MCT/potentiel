import { listerProjetsNonNotifiés } from '@infra/sequelize/queries/project/lister/requêtes/listerProjetsNonNotifiés'
import { makeListerProjetsÀNotifier } from '@infra/sequelize/queries/project/lister/listerProjetsÀNotifier'
import { oldAppelOffreRepo, oldProjectRepo } from './repos.config'

export { isPeriodeLegacy } from '@dataAccess/inMemory'
export * from '@infra/sequelize/queries'

export const listerProjetsÀNotifier = makeListerProjetsÀNotifier({
  findExistingAppelsOffres: oldProjectRepo.findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre: oldProjectRepo.findExistingPeriodesForAppelOffre,
  countUnnotifiedProjects: oldProjectRepo.countUnnotifiedProjects,
  appelOffreRepo: oldAppelOffreRepo,
  listerProjetsNonNotifiés,
})
