import { IdentifiantProjet } from '.';

import { ProjetAggregateRoot } from './projet.aggregateRoot';

export type GetProjetAggregateRoot = (
  identifiant: IdentifiantProjet.ValueType,
  skipInitialization?: boolean,
) => Promise<ProjetAggregateRoot>;
