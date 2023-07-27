import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import {
  GestionnaireRéseau,
  loadGestionnaireRéseauAggregateFactory,
} from '../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import { GarantiesFinancières, IdentifiantProjetValueType } from './projet.valueType';
import { GestionnaireRéseauProjetEvent, GarantiesFinancièresEvent } from './projet.event';
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

const projetAggregateFactory: AggregateFactory<
  Projet,
  GestionnaireRéseauProjetEvent | GarantiesFinancièresEvent
> = (events, loadAggregate) => {
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
        return event.payload.typeGarantiesFinancières === `avec date d'échéance` ||
          event.payload.typeGarantiesFinancières === 'type inconnu'
          ? {
              ...aggregate,
              garantiesFinancières: {
                ...aggregate.garantiesFinancières,
                typeGarantiesFinancières: event.payload.typeGarantiesFinancières,
                ...(event.payload.dateÉchéance && {
                  dateÉchéance: convertirEnDateTime(event.payload.dateÉchéance),
                }),
              },
            }
          : {
              ...aggregate,
              garantiesFinancières: {
                ...aggregate.garantiesFinancières,
                typeGarantiesFinancières: event.payload.typeGarantiesFinancières,
                dateÉchéance: undefined,
              },
            };
      case 'AttestationGarantiesFinancièresEnregistrée':
        return {
          ...aggregate,
          garantiesFinancières: {
            ...aggregate.garantiesFinancières,
            attestationConstitution: {
              format: event.payload.format,
              date: convertirEnDateTime(event.payload.date),
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
    return loadAggregate<Projet, GestionnaireRéseauProjetEvent & GarantiesFinancièresEvent>(
      createProjetAggregateId(identifiantProjet),
      projetAggregateFactory,
    );
  };
};
