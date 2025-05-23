import { DateTime, Email } from '@potentiel-domain/common';

import { AutoritéCompétente } from '../..';

export type AnnulerOptions = {
  dateAnnulation: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  autoritéCompétente?: AutoritéCompétente.ValueType;
};
