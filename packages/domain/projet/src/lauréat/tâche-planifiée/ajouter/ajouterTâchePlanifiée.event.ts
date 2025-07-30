import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

export type TâchePlanifiéeAjoutéeEvent = DomainEvent<
  'TâchePlanifiéeAjoutée-V1',
  | {
      identifiantProjet: IdentifiantProjet.RawType;
      typeTâchePlanifiée: string;
      ajoutéeLe: DateTime.RawType;
      àExécuterLe: DateTime.RawType;
    }
  | {
      identifiantProjet: IdentifiantProjet.RawType;
      typeTâchePlanifiée: 'représentant-légal.suppression-document-à-trois-mois';
      ajoutéeLe: DateTime.RawType;
      àExécuterLe: DateTime.RawType;
      
    }
>;
