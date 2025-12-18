import { DateTime, Email } from '@potentiel-domain/common';

import { TypeReprésentantLégal } from '..';
import { DocumentProjet } from '../../../document-projet';

export type ModifierOptions = {
  identifiantUtilisateur: Email.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  dateModification: DateTime.ValueType;
  raison?: string;
  piècesJustificatives?: DocumentProjet.ValueType;
};
