import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import { GestionnaireRéseauEvent } from './gestionnaireRéseau.event';
import { IdentifiantGestionnaireRéseauValueType } from './gestionnaireRéseau.valueType';
import { RéférenceDossierRaccordementValueType } from '../raccordement/raccordement.valueType';

type GestionnaireRéseauAggregateId = `gestionnaire-réseau#${string}`;

export const createGestionnaireRéseauAggregateId = (
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseauValueType,
): GestionnaireRéseauAggregateId =>
  `gestionnaire-réseau#${identifiantGestionnaireRéseau.formatter()}`;

export type GestionnaireRéseau = {
  codeEIC: string;
  validerRéférenceDossierRaccordement: (
    référenceDossierRaccordement: RéférenceDossierRaccordementValueType,
  ) => boolean;
  estÉgaleÀ: (gestionnaireRéseau: GestionnaireRéseau) => boolean;
};

const getDefaultAggregate = (): GestionnaireRéseau => ({
  codeEIC: '',
  estÉgaleÀ({ codeEIC }: GestionnaireRéseau) {
    return this.codeEIC === codeEIC;
  },
  validerRéférenceDossierRaccordement({ référence }) {
    return true;
  },
});

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
          return {
            ...aggregate,
            codeEIC,
            validerRéférenceDossierRaccordement({ référence }) {
              if (!expressionReguliere) {
                return true;
              }
              return new RegExp(`^${expressionReguliere}$`).test(référence);
            },
          };
        default:
          // TODO: ajouter log event non connu
          return { ...aggregate };
      }
    },
    getDefaultAggregate(),
  );
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

export const loadGestionnaireRéseauAggregateFactory = ({
  loadAggregate,
}: LoadAggregateFactoryDependencies) => {
  return async (identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseauValueType) => {
    return loadAggregate<GestionnaireRéseau, GestionnaireRéseauEvent>(
      createGestionnaireRéseauAggregateId(identifiantGestionnaireRéseau),
      gestionnaireRéseauAggregateFactory,
    );
  };
};
