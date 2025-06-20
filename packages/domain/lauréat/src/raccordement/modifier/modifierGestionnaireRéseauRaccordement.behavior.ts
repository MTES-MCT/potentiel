import { InvalidOperationError } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Raccordement } from '@potentiel-domain/projet';

import { RaccordementAggregate } from '../raccordement.aggregate';

type ModifierGestionnaireRéseauOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  rôle: Role.ValueType;
};

export async function modifierGestionnaireRéseau(
  this: RaccordementAggregate,
  { identifiantGestionnaireRéseau, identifiantProjet, rôle }: ModifierGestionnaireRéseauOptions,
) {
  if (this.identifiantGestionnaireRéseau.estÉgaleÀ(identifiantGestionnaireRéseau)) {
    throw new GestionnaireRéseauIdentiqueError(identifiantProjet, identifiantGestionnaireRéseau);
  }

  if (
    this.aUneDateDeMiseEnService() &&
    (rôle.estÉgaleÀ(Role.porteur) || rôle.estÉgaleÀ(Role.dreal))
  ) {
    throw new GestionnaireRéseauNonModifiableCarRaccordementAvecDateDeMiseEnServiceError();
  }

  if (
    identifiantGestionnaireRéseau.estÉgaleÀ(
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
    )
  ) {
    const event: Raccordement.GestionnaireRéseauInconnuAttribuéEvent = {
      type: 'GestionnaireRéseauInconnuAttribué-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    };

    await this.publish(event);
  } else {
    const event: Raccordement.GestionnaireRéseauRaccordementModifiéEvent = {
      type: 'GestionnaireRéseauRaccordementModifié-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
      },
    };

    await this.publish(event);
  }
}

export function applyGestionnaireRéseauRaccordementModifiéEventV1(
  this: RaccordementAggregate,
  {
    payload: { identifiantGestionnaireRéseau },
  }: Raccordement.GestionnaireRéseauRaccordementModifiéEvent,
) {
  this.identifiantGestionnaireRéseau =
    GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseau,
    );
}

export function applyGestionnaireRéseauRaccordemenInconnuEventV1(
  this: RaccordementAggregate,
  _: Raccordement.GestionnaireRéseauInconnuAttribuéEvent,
) {
  this.identifiantGestionnaireRéseau = GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu;
}

export class GestionnaireRéseauIdentiqueError extends InvalidOperationError {
  constructor(
    identifiantProjet: IdentifiantProjet.ValueType,
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType,
  ) {
    super(`Ce gestionnaire de réseau est déjà déclaré pour le dossier de raccordement`, {
      identifiantProjet: identifiantProjet.formatter(),
      identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
    });
  }
}

export class GestionnaireRéseauNonModifiableCarRaccordementAvecDateDeMiseEnServiceError extends InvalidOperationError {
  constructor() {
    super(
      `Le gestionnaire de réseau ne peut être modifié car le raccordement a une date de mise en service`,
    );
  }
}
