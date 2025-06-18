import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';

export type ActionnaireEvent = ActionnaireImportéEvent;

export type ActionnaireImportéEvent = DomainEvent<
  'ActionnaireImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    importéLe: DateTime.RawType;
  }
>;

export type ActionnaireModifiéEvent = DomainEvent<
  'ActionnaireModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    raison: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;
