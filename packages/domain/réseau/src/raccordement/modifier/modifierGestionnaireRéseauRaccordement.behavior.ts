import { DomainEvent, NotFoundError } from '@potentiel-domain/core';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { RaccordementAggregate } from '../raccordement.aggregate';

/**
 * @deprecated Utilisez GestionnaireRéseauRaccordementModifiéEvent et RéférenceDossierRacordementModifiéeEvent à la place. Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type GestionnaireRéseauProjetModifiéEvent = DomainEvent<
  'GestionnaireRéseauProjetModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.RawType;
  }
>;

export type GestionnaireRéseauRaccordementModifiéEvent = DomainEvent<
  'GestionnaireRéseauRaccordementModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.RawType;
  }
>;

type ModifierGestionnaireRéseauOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
};

export async function modifierGestionnaireRéseau(
  this: RaccordementAggregate,
  { identifiantGestionnaireRéseau, identifiantProjet }: ModifierGestionnaireRéseauOptions,
) {
  if (this.identifiantGestionnaireRéseau.estÉgaleÀ(identifiantGestionnaireRéseau)) {
    throw new MêmeGestionnaireRéseauUtiliséPourModifierLeRaccordementError(
      identifiantProjet,
      identifiantGestionnaireRéseau,
    );
  }

  const event: GestionnaireRéseauRaccordementModifiéEvent = {
    type: 'GestionnaireRéseauRaccordementModifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
    },
  };

  await this.publish(event);
}

export function applyGestionnaireRéseauRaccordementModifiéEventV1(
  this: RaccordementAggregate,
  { payload: { identifiantGestionnaireRéseau } }: GestionnaireRéseauRaccordementModifiéEvent,
) {
  this.identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
    identifiantGestionnaireRéseau,
  );
}

export class MêmeGestionnaireRéseauUtiliséPourModifierLeRaccordementError extends NotFoundError {
  constructor(
    identifiantProjet: IdentifiantProjet.ValueType,
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType,
  ) {
    super(`Ce gestionnaire de réseau est déjà déclaré pour le dossier de raccordement`, {
      identifiantProjet: identifiantProjet.formatter(),
      identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
    });
  }
}
