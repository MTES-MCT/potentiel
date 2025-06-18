import { IdentifiantProjet, Raccordement } from '@potentiel-domain/projet';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { RaccordementAggregate } from '../raccordement.aggregate';
import { RaccordementDéjàExistantError } from '../raccordementDéjàExistantError';

export type AttribuerGestionnaireRéseauOptions = {
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function attribuerGestionnaireRéseau(
  this: RaccordementAggregate,
  { identifiantGestionnaireRéseau, identifiantProjet }: AttribuerGestionnaireRéseauOptions,
) {
  const raccordementDéjàExistantPourLeProjet = this.identifiantProjet.estÉgaleÀ(identifiantProjet);

  if (raccordementDéjàExistantPourLeProjet) {
    throw new RaccordementDéjàExistantError(identifiantProjet.formatter());
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
    const event: Raccordement.GestionnaireRéseauAttribuéEvent = {
      type: 'GestionnaireRéseauAttribué-V1',
      payload: {
        identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
        identifiantProjet: identifiantProjet.formatter(),
      },
    };

    await this.publish(event);
  }
}

export function applyAttribuerGestionnaireRéseauEventV1(
  this: RaccordementAggregate,
  {
    payload: { identifiantGestionnaireRéseau, identifiantProjet },
  }: Raccordement.GestionnaireRéseauAttribuéEvent,
) {
  this.identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  this.identifiantGestionnaireRéseau =
    GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseau,
    );
}
