import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { DateDansLeFuturError } from '../dateDansLeFutur.error';
import { DossierRaccordementNonRéférencéError } from '../dossierRaccordementNonRéférencé.error';

export type DateMiseEnServiceTransmiseEventV1 = DomainEvent<
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
    throw new DateAntérieureDateDésignationProjetError();
  }

  if (this.contientLeDossier(référenceDossier)) {
    throw new DossierRaccordementNonRéférencéError();
  }

  const dateMiseEnServiceTransmise: DateMiseEnServiceTransmiseEventV1 = {
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
  {
    payload: { dateMiseEnService, référenceDossierRaccordement },
  }: DateMiseEnServiceTransmiseEventV1,
) {
  const dossier = this.récupérerDossier(référenceDossierRaccordement);
  dossier.miseEnService.dateMiseEnService = DateTime.convertirEnValueType(dateMiseEnService);
}

export class DateAntérieureDateDésignationProjetError extends InvalidOperationError {
  constructor() {
    super(`La date ne peut pas être antérieure à la date de désignation du projet`);
  }
}
