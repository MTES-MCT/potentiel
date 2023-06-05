import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import { GestionnaireRéseauEvent } from './gestionnaireRéseau.event';
import {
  IdentifiantGestionnaireRéseau,
  formatIdentifiantGestionnaireRéseau,
} from './gestionnaireRéseau.valueType';

type GestionnaireRéseauAggregateId = `gestionnaire-réseau#${string}`;

export const createGestionnaireRéseauAggregateId = (
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau,
): GestionnaireRéseauAggregateId =>
  `gestionnaire-réseau#${formatIdentifiantGestionnaireRéseau(identifiantGestionnaireRéseau)}`;

export type GestionnaireRéseau = {
  codeEIC: string;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement?: {
    format: string;
    légende: string;
    expressionReguliere: string;
  };
  equals: (gestionnaireRéseau: GestionnaireRéseau) => boolean;
};

const defaultAggregateState: GestionnaireRéseau = {
  raisonSociale: '',
  codeEIC: '',
  equals({ codeEIC }: GestionnaireRéseau) {
    return this.codeEIC === codeEIC;
  },
};

const gestionnaireRéseauAggregateFactory: AggregateFactory<
  GestionnaireRéseau,
  GestionnaireRéseauEvent
> = (events) => {
  return events.reduce((aggregate, event) => {
    switch (event.type) {
      case 'GestionnaireRéseauAjouté':
      case 'GestionnaireRéseauModifié':
        return { ...aggregate, ...event.payload };
      default:
        // TODO: ajouter log event non connu
        return { ...aggregate };
    }
  }, defaultAggregateState);
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

export const loadGestionnaireRéseauAggregateFactory = ({
  loadAggregate,
}: LoadAggregateFactoryDependencies) => {
  return async (identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau) => {
    return loadAggregate<GestionnaireRéseau, GestionnaireRéseauEvent>(
      createGestionnaireRéseauAggregateId(identifiantGestionnaireRéseau),
      gestionnaireRéseauAggregateFactory,
    );
  };
};
