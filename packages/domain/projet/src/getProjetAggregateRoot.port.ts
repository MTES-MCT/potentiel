import { IdentifiantProjet } from './index.js';

import { ProjetAggregateRoot } from './projet.aggregateRoot.js';

export type GetProjetAggregateRoot = (
  identifiant: IdentifiantProjet.ValueType,
  skipChildrenInitialization?: boolean,
) => Promise<ProjetAggregateRoot>;
