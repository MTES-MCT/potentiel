import { DateTime, Email } from '@potentiel-domain/common';

import { TypeReprésentantLégal } from '../..';
import { DocumentProjet } from '../../../..';

export type EnregistrerChangementOptions = {
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateChangement: DateTime.ValueType;
};
