import { match } from 'ts-pattern';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import {
  LauréatNotifiéEvent,
  LauréatNotifiéV1Event,
  NomEtLocalitéLauréatImportésEvent,
  applyLauréatNotifié,
  applyLauréatNotifiéV1,
  applyNomEtlocalitéLauréatImportés,
  notifier,
} from './notifier/notifierLauréat.behavior';
import {
  LauréatModifiéEvent,
  modifier,
  applyLauréatModifié,
} from './modifier/modifierLauréat.behavior';
import {
  CahierDesChargesModifiéEvent,
  modifierCahierDesCharges,
  applyCahierDesChargesModifié,
} from './modifier/modifierCahierDesCharges.behavior';

export type LauréatEvent =
  | LauréatNotifiéEvent
  | LauréatNotifiéV1Event
  | NomEtLocalitéLauréatImportésEvent
  | LauréatModifiéEvent
  | CahierDesChargesModifiéEvent;

export type LauréatAggregate = Aggregate<LauréatEvent> & {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  nomProjet: string;
  localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    département: string;
    région: string;
  };
  cahierDesCharges: AppelOffre.CahierDesChargesRéférence;
  notifier: typeof notifier;
  modifier: typeof modifier;
  modifierCahierDesCharges: typeof modifierCahierDesCharges;
};

export const getDefaultLauréatAggregate: GetDefaultAggregateState<
  LauréatAggregate,
  LauréatEvent
> = () => ({
  identifiantProjet: IdentifiantProjet.inconnu,
  notifiéLe: DateTime.now(),
  nomProjet: '',
  localité: {
    adresse1: '',
    adresse2: '',
    codePostal: '',
    commune: '',
    département: '',
    région: '',
  },
  cahierDesCharges: 'initial',
  apply,
  notifier,
  modifier,
  modifierCahierDesCharges,
});

function apply(this: LauréatAggregate, event: LauréatEvent) {
  match(event)
    .with({ type: 'LauréatNotifié-V1' }, applyLauréatNotifiéV1.bind(this))
    .with({ type: 'NomEtLocalitéLauréatImportés-V1' }, applyNomEtlocalitéLauréatImportés.bind(this))
    .with({ type: 'LauréatNotifié-V2' }, applyLauréatNotifié.bind(this))
    .with({ type: 'LauréatModifié-V1' }, applyLauréatModifié.bind(this))
    .with({ type: 'CahierDesChargesModifié-V1' }, applyCahierDesChargesModifié.bind(this))
    .exhaustive();
}

export const loadLauréatFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `lauréat|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultLauréatAggregate,
      onNone: throwOnNone
        ? () => {
            throw new LauréatNonTrouvéError();
          }
        : undefined,
    });
  };

class LauréatNonTrouvéError extends AggregateNotFoundError {
  constructor() {
    super(`Le projet lauréat n'existe pas`);
  }
}
