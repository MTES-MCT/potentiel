import { AppelOffre, Periode } from '../../entities'
import { asLiteral } from '../../helpers/asLiteral'
import _ from 'lodash'
import { ValuesType } from 'utility-types'

import {
  fessenheim,
  batiment,
  sol,
  innovation,
  zni,
  autoconsommationMetropole,
  autoconsommationZNI,
} from './appelsOffres'

const appelsOffreStatic = [
  batiment,
  fessenheim,
  sol,
  innovation,
  zni,
  autoconsommationMetropole,
  autoconsommationZNI,
]

const appelOffreRepo = {
  findAll: async () => {
    return appelsOffreStatic
  },
  findById: async (id: AppelOffre['id'], periodeId?: Periode['id']) => {
    const appelOffre = appelsOffreStatic.find((ao) => ao.id === id)

    if (appelOffre && periodeId) {
      appelOffre.periode = appelOffre.periodes.find(
        (periode) => periode.id === periodeId
      )
      // console.log('Setting appelOffre.periode to ', appelOffre.periode)
    }

    return appelOffre
  },
}

export { appelOffreRepo, appelsOffreStatic }
