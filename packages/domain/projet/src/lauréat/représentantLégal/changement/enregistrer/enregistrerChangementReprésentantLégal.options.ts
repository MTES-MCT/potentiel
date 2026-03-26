import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '#document-projet';

import { TypeReprésentantLégal } from '../../index.js';

export type EnregistrerChangementOptions = {
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateChangement: DateTime.ValueType;
};
