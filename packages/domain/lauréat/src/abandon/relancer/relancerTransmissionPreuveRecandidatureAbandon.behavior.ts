import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { AbandonAggregate } from '../abandon.aggregate';

const dateLégaleRelance = DateTime.convertirEnValueType(new Date('2025-03-31'));

export type RelancerTransmissionPreuveRecandidatureOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateRelance: DateTime.ValueType;
};

export async function relancerTransmissionPreuveRecandidature(
  this: AbandonAggregate,
  { identifiantProjet, dateRelance }: RelancerTransmissionPreuveRecandidatureOptions,
) {
  if (dateRelance.estUltérieureÀ(dateLégaleRelance)) {
    throw new Error('Impossible de relancer le porteur après la date légale du 31/03/2025');
  }
  return Promise.resolve();
}
