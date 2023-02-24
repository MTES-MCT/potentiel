import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '@core/domain';
import { ok } from '@core/utils';
import { GestionnaireRéseauAjouté } from './ajouter';

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
  const agrégatParDefaut: GestionnaireRéseau = {
    id,
    codeEIC: '',
    raisonSociale: '',
    légende: '',
    format: '',
    pendingEvents: [],
  };

  const agrégat: GestionnaireRéseau = events.reduce(
    (agrégat, event) => {
      switch (event.type) {
        case GestionnaireRéseauAjouté.type:
          return { ...agrégat, ...event.payload, id: new UniqueEntityID(event.payload.codeEIC) };
        default:
          return agrégat;
      }
    },
    { agrégatParDefaut },
  );
  return ok(agrégat);
};
