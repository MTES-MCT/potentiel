import { DateTime, Email } from '@potentiel-domain/common';

export type SupprimerChangementActionnaireOptions = {
  dateSuppression: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
};
