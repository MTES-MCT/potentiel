import { IdentifiantProjet } from '@potentiel-domain/common';
import { InvalidOperationError } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { Raccordement } from '@potentiel-domain/projet';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../../raccordement.aggregate';

type SupprimerDossierDuRaccordementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
};

export async function supprimerDossier(
  this: RaccordementAggregate,
  { identifiantProjet, référenceDossier }: SupprimerDossierDuRaccordementOptions,
) {
  const dossierActuel = this.récupérerDossier(référenceDossier.formatter());

  if (Option.isSome(dossierActuel.miseEnService.dateMiseEnService)) {
    throw new DossierAvecDateDeMiseEnServiceNonSupprimableError();
  }

  const dossierDuRaccordementSupprimé: Raccordement.DossierDuRaccordementSuppriméEvent = {
    type: 'DossierDuRaccordementSupprimé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossier: référenceDossier.formatter(),
    },
  };

  await this.publish(dossierDuRaccordementSupprimé);
}

export function applyDossierDuRaccordementSuppriméEventV1(
  this: RaccordementAggregate,
  event: Raccordement.DossierDuRaccordementSuppriméEvent,
) {
  this.dossiers.delete(event.payload.référenceDossier);
}

class DossierAvecDateDeMiseEnServiceNonSupprimableError extends InvalidOperationError {
  constructor() {
    super(`Un dossier avec une date de mise en service ne peut pas être supprimé`);
  }
}
