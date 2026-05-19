import type { IdentifiantProjet } from './index.js';
import type { ProjetAggregateRoot } from './projet.aggregateRoot.js';

export type GetProjetAggregateRoot = (
  identifiant: IdentifiantProjet.ValueType,
  skipChildrenInitialization?: boolean,
) => Promise<ProjetAggregateRoot>;
