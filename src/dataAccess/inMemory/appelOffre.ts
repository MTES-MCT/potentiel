import { AppelOffre, Famille, Periode } from '@entities'
import _ from 'lodash'

import {
  fessenheim,
  batiment,
  sol,
  innovation,
  zni,
  zni2017,
  autoconsommationMetropole,
  autoconsommationMetropole2016,
  autoconsommationZNI,
  autoconsommationZNI2017,
  eolien,
  solPPE2,
  eolienPPE2,
  batimentPPE2,
  neutrePPE2,
  innovationPPE2,
  autoconsommationMetropolePPE2,
} from './appelsOffres'
import { errAsync, okAsync } from '@core/utils'
import { EntityNotFoundError } from '@modules/shared'
import { GetPeriodeTitle, GetFamille } from '@modules/appelOffre'

const appelsOffreStatic = [
  batiment,
  fessenheim,
  sol,
  innovation,
  zni,
  zni2017,
  autoconsommationMetropole,
  autoconsommationMetropole2016,
  autoconsommationZNI,
  autoconsommationZNI2017,
  eolien,
  solPPE2,
  eolienPPE2,
  batimentPPE2,
  neutrePPE2,
  innovationPPE2,
  autoconsommationMetropolePPE2,
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

export { appelOffreRepo, appelsOffreStatic }
