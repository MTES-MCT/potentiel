import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

export const getAutoritéCompétenteLabel = (
  autorité: Lauréat.Abandon.AutoritéCompétente.RawType | Lauréat.Délai.AutoritéCompétente.RawType,
): string =>
  match(autorité)
    .with('dreal', () => 'DREAL, DEAL')
    .with('dgec', () => 'DGEC')
    .exhaustive();
