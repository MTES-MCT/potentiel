import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { AbandonAggregate } from '../abandon.aggregate';

export type PreuveRecandidatureTransmiseEvent = DomainEvent<
  'PreuveRecandidatureTransmise-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    preuveRecandidature: IdentifiantProjet.RawType;
  }
>;

class AbandonPasDansUnContexteDeRecandidatureError extends InvalidOperationError {
  constructor() {
    super(`Il est impossible de transmettre une preuve pour un abandon sans recandidature`);
  }
}

class TranmissionPreuveRecandidatureImpossibleError extends InvalidOperationError {
  constructor() {
    super(
      `Il est impossible de transmettre une preuve de recandidature pour un abandon non accordé`,
    );
  }
}

class ProjetNotifiéAvantLaDateMinimumError extends InvalidOperationError {
  constructor() {
    super(
      `Il est impossible de transmettre comme preuve de recandidature un projet ayant été notifié avant le 15/12/2023`,
    );
  }
}

class ProjetNotifiéAprèsLaDateMaximumError extends InvalidOperationError {
  constructor() {
    super(
      `Il est impossible de transmettre comme preuve de recandidature un projet ayant été notifié après le 31/03/2024`,
    );
  }
}

export type TransmettrePreuveRecandidatureOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  preuveRecandidature: IdentifiantProjet.ValueType;
  dateNotification: DateTime.ValueType;
  utilisateur: IdentifiantUtilisateur.ValueType;
};

export async function transmettrePreuveRecandidature(
  this: AbandonAggregate,
  {
    identifiantProjet,
    preuveRecandidature,
    dateNotification,
  }: TransmettrePreuveRecandidatureOptions,
) {
  if (!this.demande.recandidature) {
    throw new AbandonPasDansUnContexteDeRecandidatureError();
  }

  if (!this.statut.estAccordé()) {
    throw new TranmissionPreuveRecandidatureImpossibleError();
  }

  if (dateNotification.estAntérieurÀ(new Date('15/12/2023'))) {
    throw new ProjetNotifiéAvantLaDateMinimumError();
  }

  if (dateNotification.estUltérieureÀ(new Date('31/03/2024'))) {
    throw new ProjetNotifiéAprèsLaDateMaximumError();
  }

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
