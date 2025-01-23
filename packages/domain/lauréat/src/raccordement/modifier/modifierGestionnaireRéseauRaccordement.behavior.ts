import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { RaccordementAggregate } from '../raccordement.aggregate';
import { GestionnaireRéseauInconnuAttribuéEvent } from '../attribuer/attribuerGestionnaireRéseau.behavior';

/**
 * @deprecated Utilisez GestionnaireRéseauRaccordementModifiéEvent et RéférenceDossierRacordementModifiéeEvent à la place. Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type GestionnaireRéseauProjetModifiéEvent = DomainEvent<
  'GestionnaireRéseauProjetModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.RawType;
  }
>;

export type GestionnaireRéseauRaccordementModifiéEvent = DomainEvent<
  'GestionnaireRéseauRaccordementModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.RawType;
  }
>;

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
    const event: GestionnaireRéseauInconnuAttribuéEvent = {
      type: 'GestionnaireRéseauInconnuAttribué-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    };

    await this.publish(event);
  } else {
    const event: GestionnaireRéseauRaccordementModifiéEvent = {
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
  { payload: { identifiantGestionnaireRéseau } }: GestionnaireRéseauRaccordementModifiéEvent,
) {
  this.identifiantGestionnaireRéseau =
    GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseau,
    );
}

export function applyGestionnaireRéseauRaccordemenInconnuEventV1(
  this: RaccordementAggregate,
  _: GestionnaireRéseauInconnuAttribuéEvent,
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
