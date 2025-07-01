import { DateTime, Email } from '@potentiel-domain/common';

export type AnnulerOptions = {
  identifiantUtilisateur: Email.ValueType;
  dateAnnulation: DateTime.ValueType;
};
