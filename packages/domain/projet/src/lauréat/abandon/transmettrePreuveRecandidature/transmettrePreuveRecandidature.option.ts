import { DateTime, Email } from '@potentiel-domain/common';

import { ProjetAggregateRoot } from '../../..';

export type TransmettrePreuveRecandidatureOptions = {
  preuveRecandidature: ProjetAggregateRoot;
  identifiantUtilisateur: Email.ValueType;
  dateTransmissionPreuveRecandidature: DateTime.ValueType;
};
