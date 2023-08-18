import { ResultAsync } from '../../../core/utils';
import { AppelOffre, Famille } from '@potentiel/domain-views';
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared';

export type GetFamille = (
  appelOffreId: AppelOffre['id'],
  familleId: Famille['id'],
) => ResultAsync<Famille, InfraNotAvailableError | EntityNotFoundError>;
