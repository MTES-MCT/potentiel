import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../index.js';

export type ProducteurImportéEvent = DomainEvent<
  'ProducteurImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    producteur: string;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
  }
>;

export type ProducteurImportéV2Event = DomainEvent<
  'ProducteurImporté-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    producteur: string;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
    numéroImmatriculation:
      | {
          siret: string;
        }
      | {
          siren?: string;
        };
  }
>;
