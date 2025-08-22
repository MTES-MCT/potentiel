import type { DateTime, Email } from '@potentiel-domain/common';

import type { ProjetAggregateRoot } from '../../..';

export type TransmettrePreuveRecandidatureOptions = {
  preuveRecandidature: ProjetAggregateRoot;
  identifiantUtilisateur: Email.ValueType;
  dateTransmissionPreuveRecandidature: DateTime.ValueType;
};
