import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { DateDansLeFuturError } from '../dateDansLeFutur.error';
import { DossierNonRéférencéPourLeRaccordementDuProjetError } from '../dossierNonRéférencéPourLeRaccordementDuProjet.error';

/**
 * @deprecated Utilisez DateMiseEnServiceTransmiseEvent à la place
 * Ajout de l'information de l'utilisateur ayant fait l'action.
 * Avant V2, seuls les admins pouvaient transmettre la date de MES.
 */
export type DateMiseEnServiceTransmiseV1Event = DomainEvent<
  'DateMiseEnServiceTransmise-V1',
  {
    dateMiseEnService: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type DateMiseEnServiceTransmiseEvent = DomainEvent<
  'DateMiseEnServiceTransmise-V2',
  {
    dateMiseEnService: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    transmiseLe: DateTime.RawType;
    transmisePar: Email.RawType;
  }
>;

type TransmettreDateMiseEnServiceOptions = {
  dateMiseEnService: DateTime.ValueType;
  dateDésignation: DateTime.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  transmiseLe: DateTime.ValueType;
  transmisePar: Email.ValueType;
};

export async function transmettreDateMiseEnService(
  this: RaccordementAggregate,
  {
    dateMiseEnService,
    dateDésignation,
    identifiantProjet,
    référenceDossier,
    transmiseLe,
    transmisePar,
  }: TransmettreDateMiseEnServiceOptions,
) {
  if (dateMiseEnService.estDansLeFutur()) {
    throw new DateDansLeFuturError();
  }

  if (dateMiseEnService.estAntérieurÀ(dateDésignation)) {
    throw new DateMiseEnServiceAntérieureDateDésignationProjetError();
  }

  if (!this.contientLeDossier(référenceDossier)) {
    throw new DossierNonRéférencéPourLeRaccordementDuProjetError();
  }

  if (!this.dateModifiée(référenceDossier, dateMiseEnService)) {
    throw new DateIdentiqueDeMiseEnServiceDéjàTransmiseError();
  }

  const dateMiseEnServiceTransmise: DateMiseEnServiceTransmiseEvent = {
    type: 'DateMiseEnServiceTransmise-V2',
    payload: {
      dateMiseEnService: dateMiseEnService.formatter(),
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossierRaccordement: référenceDossier.formatter(),
      transmiseLe: transmiseLe.formatter(),
      transmisePar: transmisePar.formatter(),
    },
  };

  await this.publish(dateMiseEnServiceTransmise);
}

export function applyDateMiseEnServiceTransmiseEventV1(
  this: RaccordementAggregate,
  {
    payload: { dateMiseEnService, référenceDossierRaccordement },
  }: DateMiseEnServiceTransmiseV1Event,
) {
  const dossier = this.récupérerDossier(référenceDossierRaccordement);
  dossier.miseEnService.dateMiseEnService = DateTime.convertirEnValueType(dateMiseEnService);
}

export function applyDateMiseEnServiceTransmiseEventV2(
  this: RaccordementAggregate,
  { payload: { dateMiseEnService, référenceDossierRaccordement } }: DateMiseEnServiceTransmiseEvent,
) {
  const dossier = this.récupérerDossier(référenceDossierRaccordement);
  dossier.miseEnService.dateMiseEnService = DateTime.convertirEnValueType(dateMiseEnService);
}

export class DateMiseEnServiceAntérieureDateDésignationProjetError extends InvalidOperationError {
  constructor() {
    super(
      `La date de mise en service ne peut pas être antérieure à la date de désignation du projet`,
    );
  }
}

class DateIdentiqueDeMiseEnServiceDéjàTransmiseError extends InvalidOperationError {
  constructor() {
    super(`La date de mise en service est déjà transmise pour ce dossier de raccordement`);
  }
}
