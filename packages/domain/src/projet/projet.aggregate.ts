import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import {
  GestionnaireRéseau,
  loadGestionnaireRéseauAggregateFactory,
} from '../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import { GarantiesFinancières, IdentifiantProjetValueType } from './projet.valueType';
import { ProjetEvent } from './projet.event';
import { Option, none } from '@potentiel/monads';
import { convertirEnDateTime, convertirEnIdentifiantGestionnaireRéseau } from '../domain.valueType';

type ProjetAggregateId = `projet|${string}`;

export const createProjetAggregateId = (
  identifiantProjet: IdentifiantProjetValueType,
): ProjetAggregateId => {
  return `projet|${identifiantProjet.formatter()}`;
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

export type Projet = {
  getGestionnaireRéseau(): Promise<Option<GestionnaireRéseau>>;
  garantiesFinancières?: GarantiesFinancières;
};

const getDefaultAggregate = (): Projet => ({
  getGestionnaireRéseau: async () => Promise.resolve(none),
});

const projetAggregateFactory: AggregateFactory<Projet, ProjetEvent> = (events, loadAggregate) => {
  return events.reduce((aggregate, event) => {
    switch (event.type) {
      case 'GestionnaireRéseauProjetDéclaré':
      case 'GestionnaireRéseauProjetModifié':
        return {
          ...aggregate,
          getGestionnaireRéseau: async () => {
            const loadGestionnaireRéseau = loadGestionnaireRéseauAggregateFactory({
              loadAggregate,
            });
            return loadGestionnaireRéseau(
              convertirEnIdentifiantGestionnaireRéseau(event.payload.identifiantGestionnaireRéseau),
            );
          },
        };
      case 'TypeGarantiesFinancièresEnregistré':
        return event.payload.type === `avec date d'échéance` ||
          event.payload.type === 'type inconnu'
          ? {
              ...aggregate,
              garantiesFinancières: {
                ...aggregate.garantiesFinancières,
                type: event.payload.type,
                ...(event.payload.dateÉchéance && {
                  dateÉchéance: convertirEnDateTime(event.payload.dateÉchéance),
                }),
              },
            }
          : {
              ...aggregate,
              garantiesFinancières: {
                ...aggregate.garantiesFinancières,
                type: event.payload.type,
                dateÉchéance: undefined,
              },
            };
      case 'AttestationGarantiesFinancièresEnregistrée':
        return {
          ...aggregate,
          garantiesFinancières: {
            ...aggregate.garantiesFinancières,
            attestation: {
              format: event.payload.format,
              dateConstitution: convertirEnDateTime(event.payload.dateConstitution),
            },
          },
        };
      default:
        return { ...aggregate };
    }
  }, getDefaultAggregate());
};

export const loadProjetAggregateFactory = ({ loadAggregate }: LoadAggregateFactoryDependencies) => {
  return async (identifiantProjet: IdentifiantProjetValueType) => {
    return loadAggregate<Projet, ProjetEvent>(
      createProjetAggregateId(identifiantProjet),
      projetAggregateFactory,
    );
  };
};
