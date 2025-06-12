import { IdentifiantProjet } from '@potentiel-domain/projet';
import { DomainEvent } from '@potentiel-domain/core';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { RaccordementAggregate } from '../raccordement.aggregate';
import { RaccordementDéjàExistantError } from '../raccordementDéjàExistantError';

export type GestionnaireRéseauAttribuéEvent = DomainEvent<
  'GestionnaireRéseauAttribué-V1',
  {
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type GestionnaireRéseauInconnuAttribuéEvent = DomainEvent<
  'GestionnaireRéseauInconnuAttribué-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

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
    const event: GestionnaireRéseauInconnuAttribuéEvent = {
      type: 'GestionnaireRéseauInconnuAttribué-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    };

    await this.publish(event);
  } else {
    const event: GestionnaireRéseauAttribuéEvent = {
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
  }: GestionnaireRéseauAttribuéEvent,
) {
  this.identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  this.identifiantGestionnaireRéseau =
    GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseau,
    );
}
