import { EntityNotFoundError, InfraNotAvailableError } from "../../shared";
import { ResultAsync } from 'neverthrow';

export type HasDemandeDeMêmeTypeOuverte = (args: {
  projetId: string;
  type: 'recours' | 'delai' | 'abandon';
}) => ResultAsync<boolean, EntityNotFoundError | InfraNotAvailableError>;
