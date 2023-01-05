import {
  makeListerProjetsPourAdeme,
  makeListerProjetsPourAdmin,
  makeListerProjetsPourDreal,
  makeListProjects,
} from '@modules/project/queries'
import { projectRepo as OldProjectRepo, userRepo } from '@dataAccess'

export { isPeriodeLegacy } from '@dataAccess/inMemory'
export * from '@infra/sequelize/queries'

export const listProjects = makeListProjects({
  searchForRegions: OldProjectRepo.searchForRegions,
  findAllForRegions: OldProjectRepo.findAllForRegions,
  searchForUser: OldProjectRepo.searchForUser,
  findAllForUser: OldProjectRepo.findAllForUser,
  searchAll: OldProjectRepo.searchAll,
  findAll: OldProjectRepo.findAll,
  findDrealsForUser: userRepo.findDrealsForUser,
})

export const listerProjetsPourAdmin = makeListerProjetsPourAdmin({
  searchAll: OldProjectRepo.searchAll,
  findAll: OldProjectRepo.findAll,
})

export const listerProjetsPourDreal = makeListerProjetsPourDreal({
  searchForRegions: OldProjectRepo.searchForRegions,
  findAllForRegions: OldProjectRepo.findAllForRegions,
  findDrealsForUser: userRepo.findDrealsForUser,
})

export const listerProjetsPourAdeme = makeListerProjetsPourAdeme({
  searchAll: OldProjectRepo.searchAll,
  findAll: OldProjectRepo.findAll,
})
