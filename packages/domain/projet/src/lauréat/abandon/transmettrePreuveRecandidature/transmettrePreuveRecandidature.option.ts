import { DateTime, Email } from '@potentiel-domain/common';

import { ProjetAggregateRoot } from '../../../index.js';

export type TransmettrePreuveRecandidatureOptions = {
  preuveRecandidature: ProjetAggregateRoot;
  identifiantUtilisateur: Email.ValueType;
  dateTransmissionPreuveRecandidature: DateTime.ValueType;
};
