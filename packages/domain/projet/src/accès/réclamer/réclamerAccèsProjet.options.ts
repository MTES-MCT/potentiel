import { DateTime, Email } from '@potentiel-domain/common';

export type RéclamerAccèsProjetOptions = {
  identifiantUtilisateur: Email.ValueType;
  dateRéclamation: DateTime.ValueType;
} & (
  | {
      type: 'avec-prix-numéro-cre';
      numéroCRE: string;
      prix: number;
    }
  | {
      type: 'même-email-candidature';
    }
);
