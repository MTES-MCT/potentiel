import { Email, DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { Candidature, IdentifiantProjet } from '../../../..';

export type EnregistrerChangementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  actionnaire: string;
  dateChangement: DateTime.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
  typeActionnariat?: Candidature.TypeActionnariat.ValueType;
};
