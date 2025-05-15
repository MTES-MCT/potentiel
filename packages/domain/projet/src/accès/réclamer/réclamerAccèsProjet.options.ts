import { DateTime, Email } from '@potentiel-domain/common';

export type RéclamerAccèsProjetOptions = {
  identifiantUtilisateur: Email.ValueType;
  numéroCRE: string;
  prix: number;
  réclaméLe: DateTime.ValueType;
  réclaméPar: Email.ValueType;
};
