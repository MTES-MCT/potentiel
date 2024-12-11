import { IdentifiantProjet } from '@potentiel-domain/common';
import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';

import { StatutModificationActionnaire } from '.';

import {
  ActionnaireImportéEvent,
  applyActionnaireImporté,
  importer,
} from './importer/importerActionnaire.behavior';
import {
  ActionnaireModifiéEvent,
  applyActionnaireModifié,
  modifier,
} from './modifier/modifierActionnaire.behavior';
import {
  applyModificationActionnaireDemandée,
  demanderModification,
  ModificationActionnaireDemandéeEvent,
} from './demanderModification/demandeModification.behavior';

export type ActionnaireEvent =
  | ActionnaireImportéEvent
  | ActionnaireModifiéEvent
  | ModificationActionnaireDemandéeEvent;

export type ActionnaireAggregate = Aggregate<ActionnaireEvent> & {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: String;
  statutDemande?: StatutModificationActionnaire.ValueType;
  importer: typeof importer;
  modifier: typeof modifier;
  demanderModification: typeof demanderModification;
};

export const getDefaultActionnaireAggregate: GetDefaultAggregateState<
  ActionnaireAggregate,
  ActionnaireEvent
> = () => ({
  identifiantProjet: IdentifiantProjet.inconnu,
  actionnaire: '',
  apply,
  importer,
  modifier,
  demanderModification,
});

function apply(this: ActionnaireAggregate, event: ActionnaireEvent) {
  switch (event.type) {
    case 'ActionnaireImporté-V1':
      applyActionnaireImporté.bind(this)(event);
      break;

    case 'ActionnaireModifié-V1':
      applyActionnaireModifié.bind(this)(event);
      break;

    case 'ModificationActionnaireDemandée-V1':
      applyModificationActionnaireDemandée.bind(this)();
      break;
  }
}

export const loadActionnaireFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `actionnaire|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultActionnaireAggregate,
      onNone: throwOnNone
        ? () => {
            throw new ActionnaireNonTrouvéError();
          }
        : undefined,
    });
  };

class ActionnaireNonTrouvéError extends AggregateNotFoundError {
  constructor() {
    super(`L'actionnaire n'existe pas`);
  }
}
