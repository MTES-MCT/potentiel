import { DateTime, Email } from '@potentiel-domain/common';

export type SupprimerChangementPuissanceOptions = {
  dateSuppression: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
};
