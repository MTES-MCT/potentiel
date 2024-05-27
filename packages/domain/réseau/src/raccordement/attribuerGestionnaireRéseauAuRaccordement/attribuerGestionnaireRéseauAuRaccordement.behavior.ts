import { IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';

export type GestionnaireRéseauAttribuéAuRaccordementEvent = DomainEvent<
  'GestionnaireRéseauAttribuéAuRaccordement-V1',
  {
    identifiantGestionnaireRéseau: string;
    projet: {
      identifiantProjet: string;
      nomProjet: string;
      appelOffre: string;
      période: string;
      famille: string;
      numéroCRE: string;
    };
    // isValidatedByPorteur: boolean;
  }
>;

export type AttribuerGestionnaireRéseauAuRaccordementOptions = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  projet: {
    identifiantProjet: IdentifiantProjet.ValueType;
    nomProjet: string;
    appelOffre: string;
    période: string;
    famille: string;
    numéroCRE: string;
  };
};

export async function attribuerGestionnaireRéseauAuRaccordement(
  this: RaccordementAggregate,
  {
    identifiantGestionnaireRéseau,
    projet: { identifiantProjet, nomProjet, appelOffre, période, famille, numéroCRE },
  }: AttribuerGestionnaireRéseauAuRaccordementOptions,
) {
  const event: GestionnaireRéseauAttribuéAuRaccordementEvent = {
    type: 'GestionnaireRéseauAttribuéAuRaccordement-V1',
    payload: {
      identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
      projet: {
        identifiantProjet: identifiantProjet.formatter(),
        nomProjet,
        appelOffre,
        période,
        famille,
        numéroCRE,
      },
    },
  };

  await this.publish(event);
}

export function applyAttribuerGestionnaireRéseauAuRaccordementEventV1(
  this: RaccordementAggregate,
  {
    payload: { identifiantGestionnaireRéseau, projet },
  }: GestionnaireRéseauAttribuéAuRaccordementEvent,
) {
  this.identifiantProjet = IdentifiantProjet.convertirEnValueType(projet.identifiantProjet);
  this.identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
    identifiantGestionnaireRéseau,
  );
}
