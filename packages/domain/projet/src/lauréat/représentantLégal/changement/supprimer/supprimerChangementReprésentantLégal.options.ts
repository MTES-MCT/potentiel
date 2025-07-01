import { DateTime, Email } from '@potentiel-domain/common';

export type SupprimerOptions = {
  dateSuppression: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
};
