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
  findById: async (id: AppelOffre['id']) => {
    return _.cloneDeep(appelsOffreStatic.find((ao) => ao.id === id))
  },
}

export { appelOffreRepo, appelsOffreStatic }
