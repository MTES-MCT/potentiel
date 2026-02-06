import { Option } from '@potentiel-libraries/monads';

import { AppelOffreAggregate } from './appelOffre.aggregate.js';

/**
 * Type temporaire en attendant une vraie implémentation d'Appel d'offre sous la forme d'un agrégat
 */
export type LoadAppelOffreAggregatePort = (
  identifiantAppelOffre: string,
) => Promise<Option.Type<AppelOffreAggregate>>;
