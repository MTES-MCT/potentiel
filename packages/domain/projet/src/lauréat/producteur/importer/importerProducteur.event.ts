import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../index.js';
import { NuméroImmatriculation } from '../index.js';

/**
 * @deprecated
 */
export type ProducteurImportéV1Event = DomainEvent<
  'ProducteurImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    producteur: string;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
    numéroImmatriculation?: NuméroImmatriculation.RawType;
  }
>;

/**
 * @deprecated Pour mise à jour de donnée pour les V1
 */
export type SIRENImportéEvent = DomainEvent<
  'SIRENImporté',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    numéroSIREN: string;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
  }
>;

export type ProducteurImportéEvent = DomainEvent<
  'ProducteurImporté-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    producteur: string;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
    numéroImmatriculation: NuméroImmatriculation.RawType;
  }
>;
