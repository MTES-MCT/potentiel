import { DateTime, Email } from '@potentiel-domain/common';

export type AnnulerChangementOptions = {
  dateAnnulation: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
};
