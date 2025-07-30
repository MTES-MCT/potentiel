import { DateTime, Email } from '@potentiel-domain/common';

export type AnnulerDemandeDélaiOptions = {
  dateAnnulation: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
};
