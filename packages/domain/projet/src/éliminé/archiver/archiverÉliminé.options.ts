import { DateTime, Email } from '@potentiel-domain/common';

export type ArchiverÉliminéOptions = {
  dateArchive: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
};
