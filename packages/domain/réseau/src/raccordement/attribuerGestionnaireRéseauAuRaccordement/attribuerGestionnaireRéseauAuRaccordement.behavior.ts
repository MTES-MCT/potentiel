import { IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';

export type GestionnaireRéseauAttribuéAuRaccordementEvent = DomainEvent<
  'GestionnaireRéseauAttribuéAuRaccordement-V1',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type AttribuerGestionnaireRéseauAuRaccordementOptions = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.RawType;
  identifiantProjet: IdentifiantProjet.RawType;
};

export async function attribuerGestionnaireRéseauAuRaccordement(
  this: RaccordementAggregate,
  {
    identifiantGestionnaireRéseau,
    identifiantProjet,
  }: AttribuerGestionnaireRéseauAuRaccordementOptions,
) {
  const event: GestionnaireRéseauAttribuéAuRaccordementEvent = {
    type: 'GestionnaireRéseauAttribuéAuRaccordement-V1',
    payload: {
      identifiantGestionnaireRéseau,
      identifiantProjet,
    },
  };

  await this.publish(event);
}

export function applyAttribuerGestionnaireRéseauAuRaccordementEventV1(
  this: RaccordementAggregate,
  {
    payload: { identifiantGestionnaireRéseau, identifiantProjet },
  }: GestionnaireRéseauAttribuéAuRaccordementEvent,
) {
  this.identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  this.identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
    identifiantGestionnaireRéseau,
  );
}
