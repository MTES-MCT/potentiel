import { DateTime, Email } from '@potentiel-domain/common';

export type RetirerAccèsProjetOptions = {
  identifiantUtilisateur: Email.ValueType;
  retiréLe: DateTime.ValueType;
  retiréPar: Email.ValueType;
  cause?: 'changement-producteur';
};
