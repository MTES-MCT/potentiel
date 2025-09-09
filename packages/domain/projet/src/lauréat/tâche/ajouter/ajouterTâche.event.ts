import { DomainEvent } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';
import { TypeTâche } from '..';

export type TâcheAjoutéeEvent = DomainEvent<
  'TâcheAjoutée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâche: TypeTâche.RawType;
    ajoutéeLe: DateTime.RawType;
  }
>;

export type TâcheRelancéeEvent = DomainEvent<
  'TâcheRelancée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâche: TypeTâche.RawType;
    relancéeLe: DateTime.RawType;
  }
>;

export type TâcheRenouvelléeEvent = DomainEvent<
  'TâcheRenouvellée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâche: TypeTâche.RawType;
    ajoutéeLe: DateTime.RawType;
  }
>;
