import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { AbandonAggregate } from '../abandon.aggregate';

export type PreuveRecandidatureTransmiseEvent = DomainEvent<
  'PreuveRecandidatureTransmise-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    preuveRecandidature: IdentifiantProjet.RawType;
  }
>;

export type TransmettrePreuveRecandidatureOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  preuveRecandidature: IdentifiantProjet.ValueType;
  dateNotification: DateTime.ValueType;
  utilisateur: IdentifiantUtilisateur.ValueType;
};

export async function transmettrePreuveRecandidature(
  this: AbandonAggregate,
  { identifiantProjet, preuveRecandidature }: TransmettrePreuveRecandidatureOptions,
) {
  this.statut.vérifierQueStatutPermetDeTransmettrePreuveRecandidature();

  const event: PreuveRecandidatureTransmiseEvent = {
    type: 'PreuveRecandidatureTransmise-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      preuveRecandidature: preuveRecandidature.formatter(),
    },
  };

  await this.publish(event);
}

export function applyPreuveRecandidatureTransmise(
  this: AbandonAggregate,
  { payload: { preuveRecandidature } }: PreuveRecandidatureTransmiseEvent,
) {
  this.demande.preuveRecandidature = IdentifiantProjet.convertirEnValueType(preuveRecandidature);
}
