import { AppelOffre, Famille, Periode, ProjectAppelOffre } from '../../entities'
import _ from 'lodash'

import {
  fessenheim,
  batiment,
  sol,
  innovation,
  zni,
  autoconsommationMetropole,
  autoconsommationZNI,
  eolien,
} from './appelsOffres'
import { errAsync, okAsync } from '../../core/utils/Result'
import { EntityNotFoundError } from '../../modules/shared'
import { GetPeriodeTitle, GetFamille } from '../../modules/appelOffre'

const appelsOffreStatic = [
  batiment,
  fessenheim,
  sol,
  innovation,
  zni,
  autoconsommationMetropole,
  autoconsommationZNI,
  eolien,
]

const appelOffreRepo = {
  findAll: async () => {
    return appelsOffreStatic
  },
  findById: async (id: AppelOffre['id']) => {
    return _.cloneDeep(appelsOffreStatic.find((ao) => ao.id === id))
  },
  getFamille: ((appelOffreId: AppelOffre['id'], familleId: Famille['id']) => {
    const appelOffre = appelsOffreStatic.find((ao) => ao.id === appelOffreId)

    if (!appelOffre) return errAsync(new EntityNotFoundError())

    const famille = appelOffre.familles.find((famille) => famille.id === familleId)

    if (!famille) return errAsync(new EntityNotFoundError())

    return okAsync(famille)
  }) as GetFamille,
  getPeriodeTitle: ((appelOffreId: AppelOffre['id'], periodeId: Periode['id']) => {
    const appelOffre = appelsOffreStatic.find((ao) => ao.id === appelOffreId)

    if (!appelOffre) return errAsync(new EntityNotFoundError())

    const periode = appelOffre.periodes.find((periode) => periode.id === periodeId)

    if (!periode) return errAsync(new EntityNotFoundError())

    return okAsync({
      periodeTitle: periode.title,
      appelOffreTitle: appelOffre.shortTitle,
    })
  }) as GetPeriodeTitle,
}

const getAppelOffre = (args: {
  appelOffreId: string
  periodeId: string
  familleId?: string
}): ProjectAppelOffre | null => {
  const { appelOffreId, periodeId, familleId } = args
  const appelOffre = appelsOffreStatic.find((ao) => ao.id === appelOffreId) as
    | ProjectAppelOffre
    | undefined

  if (!appelOffre) return null

  const periode = appelOffre.periodes.find((periode) => periode.id === periodeId)

  if (!periode) return null

  appelOffre.periode = periode

  if (familleId) {
    appelOffre.famille = appelOffre.familles.find((famille) => famille.id === familleId)
  }

  return appelOffre
}

export { appelOffreRepo, appelsOffreStatic, getAppelOffre }
