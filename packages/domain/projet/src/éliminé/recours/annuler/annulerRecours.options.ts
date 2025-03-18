import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

export type AnnulerOptions = {
  dateAnnulation: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};
