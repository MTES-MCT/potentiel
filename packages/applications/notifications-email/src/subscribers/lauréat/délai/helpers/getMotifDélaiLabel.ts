import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

export const getMotifDélaiLabel = (motif: Lauréat.Délai.MotifDemandeDélai.RawType) =>
  match(motif)
    .with('prolongation-délai-achèvement', () => "prolongation du délai d'achèvement")
    .with('prolongation-phase-essai', () => "prolongation du délai de phase d'essai")
    .exhaustive();
