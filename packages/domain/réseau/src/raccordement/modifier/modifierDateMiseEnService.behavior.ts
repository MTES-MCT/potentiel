import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { DateDansLeFuturError } from '../dateDansLeFutur.error';

export type DateMiseEnServiceModifiéeEvent = DomainEvent<
  'DateMiseEnServiceModifiée-V1',
  {
    dateMiseEnService: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

type ModifierDateMiseEnServiceOptions = {
  dateMiseEnService: DateTime.ValueType;
  dateDésignation: DateTime.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
};

export async function modifierDateMiseEnService(
  this: RaccordementAggregate,
  {
    dateMiseEnService,
    dateDésignation,
    identifiantProjet,
    référenceDossier,
  }: ModifierDateMiseEnServiceOptions,
) {
  if (dateMiseEnService.estDansLeFutur()) {
    throw new DateDansLeFuturError();
  }

  if (dateMiseEnService.estAntérieurÀ(dateDésignation)) {
    throw new DateMiseEnServiceAntérieureDateDésignationProjetError();
  }

  const dossier = this.récupérerDossier(référenceDossier.formatter());
  if (Option.isNone(dossier.miseEnService.dateMiseEnService)) {
    throw new AucuneDateDeMiseEnServiceTransmiseError();
  }

  if (!this.dateModifiée(référenceDossier, dateMiseEnService)) {
    throw new DateDeMiseEnServiceInchangéeError();
  }

  const dateMiseEnServiceModifiée: DateMiseEnServiceModifiéeEvent = {
    type: 'DateMiseEnServiceModifiée-V1',
    payload: {
      dateMiseEnService: dateMiseEnService.formatter(),
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossierRaccordement: référenceDossier.formatter(),
    },
  };

  await this.publish(dateMiseEnServiceModifiée);
}

export function applyDateMiseEnServiceModifiéeEventV1(
  this: RaccordementAggregate,
  { payload: { dateMiseEnService, référenceDossierRaccordement } }: DateMiseEnServiceModifiéeEvent,
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

class AucuneDateDeMiseEnServiceTransmiseError extends InvalidOperationError {
  constructor() {
    super(`Aucune date de mise en service n'a encore été transmise`);
  }
}

class DateDeMiseEnServiceInchangéeError extends InvalidOperationError {
  constructor() {
    super(`La date de mise en service est inchangée`);
  }
}
