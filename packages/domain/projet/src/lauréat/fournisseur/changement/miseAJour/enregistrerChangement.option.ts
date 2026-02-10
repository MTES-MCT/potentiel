import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';
import { Fournisseur } from '../../index.js';

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
