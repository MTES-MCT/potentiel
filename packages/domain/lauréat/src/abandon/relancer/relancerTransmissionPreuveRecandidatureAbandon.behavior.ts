import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { AbandonAggregate } from '../abandon.aggregate';
import { InvalidOperationError } from '@potentiel-domain/core';

const dateLégaleRelance = DateTime.convertirEnValueType(new Date('2025-03-31'));

class RelanceTransmissionPreuveRecandidatureImpossibleError extends InvalidOperationError {
  constructor() {
    super('Impossible de relancer le porteur après la date légale du 31/03/2025');
  }
}

export type RelancerTransmissionPreuveRecandidatureOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateRelance: DateTime.ValueType;
};

export async function relancerTransmissionPreuveRecandidature(
  this: AbandonAggregate,
  { identifiantProjet, dateRelance }: RelancerTransmissionPreuveRecandidatureOptions,
) {
  if (dateRelance.estUltérieureÀ(dateLégaleRelance)) {
    throw new RelanceTransmissionPreuveRecandidatureImpossibleError();
  }
  return Promise.resolve();
}
