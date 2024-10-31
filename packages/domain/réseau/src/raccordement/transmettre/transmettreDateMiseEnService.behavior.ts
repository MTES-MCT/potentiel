import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { DateDansLeFuturError } from '../dateDansLeFutur.error';

export type DateMiseEnServiceTransmiseEvent = DomainEvent<
  'DateMiseEnServiceTransmise-V1',
  {
    dateMiseEnService: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

type TransmettreDateMiseEnServiceOptions = {
  dateMiseEnService: DateTime.ValueType;
  dateDésignation: DateTime.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
};

export async function transmettreDateMiseEnService(
  this: RaccordementAggregate,
  {
    dateMiseEnService,
    dateDésignation,
    identifiantProjet,
    référenceDossier,
  }: TransmettreDateMiseEnServiceOptions,
) {
  if (dateMiseEnService.estDansLeFutur()) {
    throw new DateDansLeFuturError();
  }

  if (dateMiseEnService.estAntérieurÀ(dateDésignation)) {
    throw new DateMiseEnServiceAntérieureDateDésignationProjetError();
  }
  const dossier = this.récupérerDossier(référenceDossier.référence);

  if (Option.isSome(dossier.miseEnService.dateMiseEnService)) {
    throw new DateMiseEnServiceDéjàTransmiseError();
  }

  const dateMiseEnServiceTransmise: DateMiseEnServiceTransmiseEvent = {
    type: 'DateMiseEnServiceTransmise-V1',
    payload: {
      dateMiseEnService: dateMiseEnService.formatter(),
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossierRaccordement: référenceDossier.formatter(),
    },
  };

  await this.publish(dateMiseEnServiceTransmise);
}

export function applyDateMiseEnServiceTransmiseEventV1(
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

class DateMiseEnServiceDéjàTransmiseError extends InvalidOperationError {
  constructor() {
    super(`La date de mise en service est déjà transmise pour ce dossier de raccordement`);
  }
}
