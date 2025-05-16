import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../raccordement.aggregate';

export type DateMiseEnServiceSuppriméeEvent = DomainEvent<
  'DateMiseEnServiceSupprimée-V1',
  {
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméeLe: DateTime.RawType;
    suppriméePar: Email.RawType;
  }
>;

type SupprimerDateMiseEnServiceOptions = {
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  suppriméeLe: DateTime.ValueType;
  suppriméePar: Email.ValueType;
};

export async function supprimerDateMiseEnService(
  this: RaccordementAggregate,
  {
    identifiantProjet,
    référenceDossier,
    suppriméeLe,
    suppriméePar,
  }: SupprimerDateMiseEnServiceOptions,
) {
  const { miseEnService } = this.récupérerDossier(référenceDossier.formatter());
  if (Option.isNone(miseEnService.dateMiseEnService)) {
    throw new DossierRaccordementPasEnServiceError();
  }

  const dateMiseEnServiceSupprimée: DateMiseEnServiceSuppriméeEvent = {
    type: 'DateMiseEnServiceSupprimée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossierRaccordement: référenceDossier.formatter(),
      suppriméeLe: suppriméeLe.formatter(),
      suppriméePar: suppriméePar.formatter(),
    },
  };

  await this.publish(dateMiseEnServiceSupprimée);
}

export function applyDateMiseEnServiceSuppriméeEventV1(
  this: RaccordementAggregate,
  { payload: { référenceDossierRaccordement } }: DateMiseEnServiceSuppriméeEvent,
) {
  const dossier = this.récupérerDossier(référenceDossierRaccordement);
  dossier.miseEnService = {
    dateMiseEnService: Option.none,
  };
}

class DossierRaccordementPasEnServiceError extends Error {
  constructor() {
    super(`Le dossier de raccordement n'est pas en service`);
  }
}
