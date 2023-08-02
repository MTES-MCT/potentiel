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
    case 'TypeGarantiesFinancièresEnregistré-v0':
      if ('typeGarantiesFinancières' in event.payload) {
        return {
          ...aggregate,
          garantiesFinancières: {
            ...aggregate.garantiesFinancières,
            typeGarantiesFinancières: event.payload.typeGarantiesFinancières,
            dateÉchéance:
              event.payload.typeGarantiesFinancières === `avec date d'échéance`
                ? convertirEnDateTime(event.payload.dateÉchéance)
                : undefined,
          },
        };
      } else {
        return {
          ...aggregate,
          garantiesFinancières: {
            ...aggregate.garantiesFinancières,
            dateÉchéance: convertirEnDateTime(event.payload.dateÉchéance),
          },
        };
      }
    case 'TypeGarantiesFinancièresEnregistré-v1':
      return {
        ...aggregate,
        garantiesFinancières: {
          ...aggregate.garantiesFinancières,
          typeGarantiesFinancières: event.payload.typeGarantiesFinancières,
          dateÉchéance:
            event.payload.typeGarantiesFinancières === `avec date d'échéance`
              ? convertirEnDateTime(event.payload.dateÉchéance)
              : undefined,
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
