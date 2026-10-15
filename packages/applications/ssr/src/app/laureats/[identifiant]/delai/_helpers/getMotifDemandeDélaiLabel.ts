import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

export const getMotifDemandeDélaiLabel = (motif: Lauréat.Délai.MotifDemandeDélai.RawType) =>
  match(motif)
    .with('force-majeure', () => 'Force Majeure')
    .with('prolongation-phase-essai', () => "Prolongation de phase d'essai")
    .exhaustive();
