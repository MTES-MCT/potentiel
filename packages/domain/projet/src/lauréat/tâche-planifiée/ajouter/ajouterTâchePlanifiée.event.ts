import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

export type TâchePlanifiéeAjoutéeEvent = DomainEvent<
  'TâchePlanifiéeAjoutée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâchePlanifiée: string;
    ajoutéeLe: DateTime.RawType;
    àExécuterLe: DateTime.RawType;
  }
>;
