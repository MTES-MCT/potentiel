import { EntityNotFoundError, InfraNotAvailableError } from '../../shared';
import { ResultAsync } from 'neverthrow';

export type HasDemandeDeMêmeTypeOuverte = (args: {
  projetId: string;
  type: 'recours' | 'delai';
}) => ResultAsync<boolean, EntityNotFoundError | InfraNotAvailableError>;
