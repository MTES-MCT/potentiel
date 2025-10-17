import { match } from 'ts-pattern';

import { Zone } from '@potentiel-domain/utilisateur';

export const getZoneLabel = (zone: Zone.RawType): string =>
  match(zone)
    .with('métropole', () => 'Métropole')
    .with('mayotte', () => 'Mayotte')
    .with('zni', () => 'ZNI')
    .exhaustive();
