import { DateTime, Email } from '@potentiel-domain/common';

export type RejeterOptions = {
  identifiantUtilisateur: Email.ValueType;
  dateRejet: DateTime.ValueType;
  motifRejet: string;
  rejetAutomatique: boolean;
};
