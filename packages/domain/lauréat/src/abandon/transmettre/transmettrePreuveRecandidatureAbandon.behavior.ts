import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { InvalidOperationError } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { Lauréat } from '@potentiel-domain/projet';

import { AbandonAggregate } from '../abandon.aggregate';

class PreuveRecandidautreDéjàTransmise extends InvalidOperationError {
  constructor() {
    super('La preuve de recandidature a déjà été transmise');
  }
}

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

class ProjetNonNotifiéError extends InvalidOperationError {
  constructor() {
    super(`Il est impossible de transmettre une preuve de recandidature non notifiée`);
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
      `Il est impossible de transmettre comme preuve de recandidature un projet ayant été notifié après le 31/03/2025`,
    );
  }
}

export type TransmettrePreuveRecandidatureOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  preuveRecandidature: IdentifiantProjet.ValueType;
  dateNotification?: DateTime.ValueType;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  dateTransmissionPreuveRecandidature: DateTime.ValueType;
};

export async function transmettrePreuveRecandidature(
  this: AbandonAggregate,
  {
    identifiantProjet,
    preuveRecandidature,
    dateNotification,
    identifiantUtilisateur,
    dateTransmissionPreuveRecandidature,
  }: TransmettrePreuveRecandidatureOptions,
) {
  if (!this.demande.recandidature) {
    throw new AbandonPasDansUnContexteDeRecandidatureError();
  }

  if (this.demande.preuveRecandidature) {
    throw new PreuveRecandidautreDéjàTransmise();
  }

  if (!this.statut.estAccordé()) {
    throw new TranmissionPreuveRecandidatureImpossibleError();
  }

  if (!dateNotification) {
    throw new ProjetNonNotifiéError();
  }

  if (dateNotification.estAntérieurÀ(DateTime.convertirEnValueType(new Date('2023-12-15')))) {
    throw new ProjetNotifiéAvantLaDateMinimumError();
  }

  if (dateNotification.estUltérieureÀ(DateTime.convertirEnValueType(new Date('2025-03-31')))) {
    throw new ProjetNotifiéAprèsLaDateMaximumError();
  }

  const event: Lauréat.Abandon.PreuveRecandidatureTransmiseEvent = {
    type: 'PreuveRecandidatureTransmise-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      preuveRecandidature: preuveRecandidature.formatter(),
      transmisePar: identifiantUtilisateur.formatter(),
      transmiseLe: dateTransmissionPreuveRecandidature.formatter(),
    },
  };

  await this.publish(event);
}

export function applyPreuveRecandidatureTransmise(
  this: AbandonAggregate,
  {
    payload: { preuveRecandidature, transmisePar, transmiseLe },
  }: Lauréat.Abandon.PreuveRecandidatureTransmiseEvent,
) {
  this.demande.preuveRecandidature = IdentifiantProjet.convertirEnValueType(preuveRecandidature);
  this.demande.preuveRecandidatureTransmiseLe = DateTime.convertirEnValueType(transmiseLe);
  this.demande.preuveRecandidatureTransmisePar =
    IdentifiantUtilisateur.convertirEnValueType(transmisePar);
}
