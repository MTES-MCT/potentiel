import { ResultAsync } from '@core/utils'
import { AppelOffre, Periode } from '@entities'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'

export type GetPeriodeTitle = (
  appelOffreId: AppelOffre['id'],
  periodeId: Periode['id']
) => ResultAsync<
  {
    appelOffreTitle: string
    periodeTitle: string
  },
  InfraNotAvailableError | EntityNotFoundError
>
