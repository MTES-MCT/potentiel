import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';
import { Fournisseur } from '../..';

export type FournisseurModifiéEvent = DomainEvent<
  'FournisseurModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    fournisseurs?: Array<Fournisseur.RawType>;
    évaluationCarboneSimplifiée?: number;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    raison?: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;
