import { DateTime, Email } from '@potentiel-domain/common';

export type AnnulerOptions = {
  dateAnnulation: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
};
