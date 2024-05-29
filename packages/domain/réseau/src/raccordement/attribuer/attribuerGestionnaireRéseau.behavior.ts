import { IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { RaccordementDéjàExistantError } from '../raccordementDéjàExistantError';

export type GestionnaireRéseauAttribuéEvent = DomainEvent<
  'GestionnaireRéseauAttribué-V1',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type AttribuerGestionnaireRéseauOptions = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.RawType;
  identifiantProjet: IdentifiantProjet.RawType;
};

export async function attribuerGestionnaireRéseau(
  this: RaccordementAggregate,
  { identifiantGestionnaireRéseau, identifiantProjet }: AttribuerGestionnaireRéseauOptions,
) {
  const raccordementDéjàExistantPourLeProjet = this.identifiantProjet.estÉgaleÀ(
    IdentifiantProjet.convertirEnValueType(identifiantProjet),
  );

  if (raccordementDéjàExistantPourLeProjet) {
    throw new RaccordementDéjàExistantError(identifiantProjet);
  }

  const event: GestionnaireRéseauAttribuéEvent = {
    type: 'GestionnaireRéseauAttribué-V1',
    payload: {
      identifiantGestionnaireRéseau,
      identifiantProjet,
    },
  };

  await this.publish(event);
}

export function applyAttribuerGestionnaireRéseauEventV1(
  this: RaccordementAggregate,
  {
    payload: { identifiantGestionnaireRéseau, identifiantProjet },
  }: GestionnaireRéseauAttribuéEvent,
) {
  this.identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  this.identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
    identifiantGestionnaireRéseau,
  );
}
