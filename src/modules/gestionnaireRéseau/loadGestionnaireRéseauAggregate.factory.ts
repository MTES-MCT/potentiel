import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '@core/domain';
import { ok } from '@core/utils';
import { AggregateId, LoadAggregate } from '@potentiel/core-domain';
import { GestionnaireRéseauAjouté } from './ajouter';
import { GestionnaireRéseauModifiéEvent } from './modifier/gestionnaireRéseauModifiéEvent';

type GestionnaireRéseauArgs = {
  id: UniqueEntityID;
  events?: DomainEvent[];
};

export type GestionnaireRéseau = EventStoreAggregate & {
  codeEIC: string;
  raisonSociale: string;
  légende: string;
  format: string;
};

export const makeGestionnaireRéseau = (args: GestionnaireRéseauArgs) => {
  const { events = [], id } = args;

  const agrégat = events.reduce<GestionnaireRéseau>(
    (agrégat, event) => {
      switch (event.type) {
        case GestionnaireRéseauAjouté.name:
          return { ...agrégat, ...event.payload, id: new UniqueEntityID(event.payload.codeEIC) };
        default:
          return { ...agrégat };
      }
    },
    {
      id,
      codeEIC: '',
      raisonSociale: '',
      légende: '',
      format: '',
      pendingEvents: [],
    },
  );
  return ok(agrégat);
};

// nouveau monde
type GestionnaireRéseauState = { codeEIC: string; raisonSociale: string };
type GestionnaireRéseauEvent = GestionnaireRéseauModifiéEvent;
type LoadGestionnaireRéseauAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

export const loadGestionnaireRéseauAggregateFactory =
  ({ loadAggregate }: LoadGestionnaireRéseauAggregateFactoryDependencies) =>
  (codeEIC: string) => {
    const aggregateId = `gestionnaire-réseau#${codeEIC}` satisfies AggregateId;

    return loadAggregate<GestionnaireRéseauState, GestionnaireRéseauEvent>(
      aggregateId,
      (events) => {
        return events.reduce(
          (aggregate, event) => {
            switch (event.type) {
              case 'GestionnaireRéseauModifié':
                return { ...aggregate, ...event.payload };
              default:
                // TODO: ajouter log event non connu
                return { ...aggregate };
            }
          },
          { raisonSociale: '', codeEIC },
        );
      },
    );
  };
