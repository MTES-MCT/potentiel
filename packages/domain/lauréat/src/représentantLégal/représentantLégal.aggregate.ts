import { match } from 'ts-pattern';

import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { StatutChangementReprésentantLégal, TypeReprésentantLégal } from '.';

import {
  applyReprésentantLégalImporté,
  importer,
  ReprésentantLégalImportéEvent,
} from './importer/importerReprésentantLégal.behavior';
import {
  applyReprésentantLégalModifié,
  modifier,
  ReprésentantLégalModifiéEvent,
} from './modifier/modifierReprésentantLégal.behavior';
import {
  applyChangementReprésentantLégalDemandé,
  ChangementReprésentantLégalDemandéEvent,
  demander,
} from './changement/demander/demanderChangementReprésentantLégal.behavior';
import {
  applyChangementReprésentantLégalAccordé,
  ChangementReprésentantLégalAccordéEvent,
  accorder,
} from './changement/accorder/accorderChangementReprésentantLégal.behavior';

export type ReprésentantLégalEvent =
  | ReprésentantLégalImportéEvent
  | ReprésentantLégalModifiéEvent
  | ChangementReprésentantLégalDemandéEvent
  | ChangementReprésentantLégalAccordéEvent;

export type ReprésentantLégalAggregate = Aggregate<ReprésentantLégalEvent> & {
  représentantLégal: {
    nom: string;
    type: TypeReprésentantLégal.ValueType;
  };
  demande?: {
    nom: string;
    type: TypeReprésentantLégal.ValueType;
    statut: StatutChangementReprésentantLégal.ValueType;

    accord?: {
      nom: string;
      type: TypeReprésentantLégal.ValueType;
      accordéLe: DateTime.ValueType;
      réponseSignée: {
        format: string;
      };
    };
  };
  readonly importer: typeof importer;
  readonly modifier: typeof modifier;
  readonly demander: typeof demander;
  readonly accorder: typeof accorder;
};

export const getDefaultReprésentantLégalAggregate: GetDefaultAggregateState<
  ReprésentantLégalAggregate,
  ReprésentantLégalEvent
> = () => ({
  apply,
  représentantLégal: {
    nom: '',
    type: TypeReprésentantLégal.inconnu,
  },
  importer,
  modifier,
  demander,
  accorder,
});

function apply(this: ReprésentantLégalAggregate, event: ReprésentantLégalEvent) {
  return match(event)
    .with({ type: 'ReprésentantLégalImporté-V1' }, (event) =>
      applyReprésentantLégalImporté.bind(this)(event),
    )
    .with({ type: 'ReprésentantLégalModifié-V1' }, (event) =>
      applyReprésentantLégalModifié.bind(this)(event),
    )
    .with({ type: 'ChangementReprésentantLégalDemandé-V1' }, (event) =>
      applyChangementReprésentantLégalDemandé.bind(this)(event),
    )
    .with({ type: 'ChangementReprésentantLégalAccordé-V1' }, (event) =>
      applyChangementReprésentantLégalAccordé.bind(this)(event),
    )
    .exhaustive();
}

export const loadReprésentantLégalFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `représentant-légal|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultReprésentantLégalAggregate,
      onNone: throwOnNone
        ? () => {
            throw new AucunReprésentantLégalError();
          }
        : undefined,
    });
  };

class AucunReprésentantLégalError extends AggregateNotFoundError {
  constructor() {
    super(`Aucun représentant légal n'est associé à ce projet`);
  }
}
