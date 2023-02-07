import { listerProjets } from '@infra/sequelize/queries/project/lister/listerProjets'
import { makeListerProjetsÀNotifier } from '@infra/sequelize/queries/project/lister/listerProjetsÀNotifier'
import { oldAppelOffreRepo, oldProjectRepo } from './repos.config'

export { isPeriodeLegacy } from '@dataAccess/inMemory'
export * from '@infra/sequelize/queries'

export const listerProjetsÀNotifier = makeListerProjetsÀNotifier({
  findExistingAppelsOffres: oldProjectRepo.findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre: oldProjectRepo.findExistingPeriodesForAppelOffre,
  countUnnotifiedProjects: oldProjectRepo.countUnnotifiedProjects,
  appelOffreRepo: oldAppelOffreRepo,
  listerProjets,
})
