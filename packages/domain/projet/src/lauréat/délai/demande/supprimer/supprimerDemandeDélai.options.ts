import { DateTime, Email } from '@potentiel-domain/common';

export type SupprimerDemandeDélaiOptions = {
  dateSuppression: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
};
