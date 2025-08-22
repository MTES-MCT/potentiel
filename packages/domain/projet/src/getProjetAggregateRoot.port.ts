import type { IdentifiantProjet } from '.';
import type { ProjetAggregateRoot } from './projet.aggregateRoot';

export type GetProjetAggregateRoot = (
  identifiant: IdentifiantProjet.ValueType,
) => Promise<ProjetAggregateRoot>;
