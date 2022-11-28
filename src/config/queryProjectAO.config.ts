import { appelsOffreStatic } from '@dataAccess/inMemory'

import { makeGetProjectAppelOffre } from '@modules/projectAppelOffre'

export const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)
