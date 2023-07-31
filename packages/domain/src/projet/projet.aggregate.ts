import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import {
  GestionnaireRéseau,
  loadGestionnaireRéseauAggregateFactory,
} from '../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import { IdentifiantProjetValueType } from './projet.valueType';
import { GarantiesFinancièresEvent, ProjetEvent } from './projet.event';
import { Option, none } from '@potentiel/monads';
import { convertirEnDateTime, convertirEnIdentifiantGestionnaireRéseau } from '../domain.valueType';
import { GarantiesFinancières } from './garantiesFinancières/garantiesFinancières.valueType';

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
      case 'AttestationGarantiesFinancièresEnregistrée':
        return processGarantiesFinancièresEvent({ event, aggregate });
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

const processGarantiesFinancièresEvent = ({
  event,
  aggregate,
}: {
  event: GarantiesFinancièresEvent;
  aggregate: Projet;
}) => {
  switch (event.type) {
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
  }
};
