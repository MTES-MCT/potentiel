import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../../../..';
import { TypeFournisseur } from '../..';

export type EnregistrerChangementFournisseurOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateChangement: DateTime.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
} & (
  | {
      fournisseurs: Array<{
        typeFournisseur: TypeFournisseur.ValueType;
        nomDuFabricant: string;
      }>;
      évaluationCarboneSimplifiée?: undefined;
    }
  | {
      fournisseurs: undefined;
      évaluationCarboneSimplifiée: number;
    }
  | {
      fournisseurs: Array<{
        typeFournisseur: TypeFournisseur.ValueType;
        nomDuFabricant: string;
      }>;
      évaluationCarboneSimplifiée: number;
    }
);
