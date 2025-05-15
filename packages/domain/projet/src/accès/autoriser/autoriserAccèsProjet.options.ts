import { DateTime, Email } from '@potentiel-domain/common';

export type AutoriserAccèsProjetOptions = {
  identifiantUtilisateur: Email.ValueType;
  autoriséLe: DateTime.ValueType;
  autoriséPar: Email.ValueType;
  raison: 'invitation' | 'notification' | 'réclamation';
};
