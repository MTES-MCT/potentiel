import { IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../../raccordement.aggregate';

export type DossierDuRaccordementSuppriméEvent = DomainEvent<
  'DossierDuRaccordementSupprimé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    référenceDossier: RéférenceDossierRaccordement.RawType;
  }
>;

type SupprimerDossierDuRaccordementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  rôle: Role.ValueType;
};

export async function supprimerDossier(
  this: RaccordementAggregate,
  {
    identifiantProjet,
    référenceDossier,
    // rôle
  }: SupprimerDossierDuRaccordementOptions,
) {
  const dossierDuRaccordementSupprimé: DossierDuRaccordementSuppriméEvent = {
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
  event: DossierDuRaccordementSuppriméEvent,
) {
  this.dossiers.delete(event.payload.référenceDossier);
}
