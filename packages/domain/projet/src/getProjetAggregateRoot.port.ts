import { IdentifiantProjet } from '.';

import { ProjetAggregateRoot } from './projet.aggregateRoot';

export type GetProjetAggregateRoot = (
  identifiant: IdentifiantProjet.ValueType,
  skipChildrenInitialization?: boolean,
) => Promise<ProjetAggregateRoot>;
