import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../../..';
import { Fournisseur } from '../..';

export type EnregistrerChangementFournisseurOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateChangement: DateTime.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
} & (
  | {
      fournisseurs: Array<Fournisseur.ValueType>;
      évaluationCarboneSimplifiée?: undefined;
    }
  | {
      fournisseurs: undefined;
      évaluationCarboneSimplifiée: number;
    }
  | {
      fournisseurs: Array<Fournisseur.ValueType>;
      évaluationCarboneSimplifiée: number;
    }
);
