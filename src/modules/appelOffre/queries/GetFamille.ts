import { ResultAsync } from '../../../core/utils'
import { AppelOffre, Famille } from '../../../entities'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'

export type GetFamille = (
  appelOffreId: AppelOffre['id'],
  familleId: Famille['id']
) => ResultAsync<Famille, InfraNotAvailableError | EntityNotFoundError>
