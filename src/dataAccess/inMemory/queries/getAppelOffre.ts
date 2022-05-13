import { ResultAsync, errAsync, okAsync } from '@core/utils'
import { EntityNotFoundError } from 'src/modules/shared'
import { appelsOffreStatic } from '../appelOffre'
import { AppelOffre } from '@entities/appelOffre'

export const getAppelOffre: (
  appelOffreId: string
) => ResultAsync<AppelOffre, EntityNotFoundError> = (appelOffreId) => {
  const appelOffre = appelsOffreStatic.find((ao) => ao.id === appelOffreId)

  return appelOffre ? okAsync(appelOffre) : errAsync(new EntityNotFoundError())
}
