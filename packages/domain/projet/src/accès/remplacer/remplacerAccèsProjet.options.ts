import { DateTime, Email } from '@potentiel-domain/common';

export type RemplacerAccèsProjetOptions = {
  identifiantUtilisateur: Email.ValueType;
  nouvelIdentifiantUtilisateur: Email.ValueType;
  remplacéLe: DateTime.ValueType;
  remplacéPar: Email.ValueType;
};
