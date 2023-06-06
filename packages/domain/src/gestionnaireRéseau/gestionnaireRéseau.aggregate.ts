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
  validerRéférenceDossierRaccordement: (référence: string) => boolean;
  estÉgaleÀ: (gestionnaireRéseau: GestionnaireRéseau) => boolean;
};

const defaultAggregateState: GestionnaireRéseau = {
  codeEIC: '',
  estÉgaleÀ({ codeEIC }: GestionnaireRéseau) {
    return this.codeEIC === codeEIC;
  },
  validerRéférenceDossierRaccordement(référence: string) {
    return true;
  },
};

const gestionnaireRéseauAggregateFactory: AggregateFactory<
  GestionnaireRéseau,
  GestionnaireRéseauEvent
> = (events) => {
  return events.reduce(
    (
      aggregate,
      {
        type,
        payload: {
          codeEIC,
          aideSaisieRéférenceDossierRaccordement: { expressionReguliere },
        },
      },
    ) => {
      switch (type) {
        case 'GestionnaireRéseauAjouté':
        case 'GestionnaireRéseauModifié':
          const validerRéférenceDossierRaccordement = (référence: string) => {
            if (!expressionReguliere) {
              return true;
            }
            return new RegExp(expressionReguliere).test(référence);
          };
          return {
            ...aggregate,
            codeEIC,
            validerRéférenceDossierRaccordement,
          };
        default:
          // TODO: ajouter log event non connu
          return { ...aggregate };
      }
    },
    defaultAggregateState,
  );
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
