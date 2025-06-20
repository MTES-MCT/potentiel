import { match } from 'ts-pattern';

import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { StatutChangementReprésentantLégal } from '.';

import {
  applyReprésentantLégalImporté,
  importer,
} from './importer/importerReprésentantLégal.behavior';
import {
  applyReprésentantLégalModifié,
  modifier,
} from './modifier/modifierReprésentantLégal.behavior';
import {
  applyChangementReprésentantLégalDemandé,
  demander,
} from './changement/demander/demanderChangementReprésentantLégal.behavior';
import {
  applyChangementReprésentantLégalAccordé,
  accorder,
} from './changement/accorder/accorderChangementReprésentantLégal.behavior';
import {
  applyChangementReprésentantLégalRejeté,
  rejeter,
} from './changement/rejeter/rejeterChangementReprésentantLégal.behavior';
import {
  applyChangementReprésentantLégalSupprimé,
  supprimer,
} from './changement/supprimer/supprimerChangementReprésentantLégal.behavior';
import {
  annuler,
  applyChangementReprésentantLégalAnnulé,
} from './changement/annuler/annulerChangementReprésentantLégal.behavior';
import {
  applyChangementReprésentantLégalCorrigé,
  corriger,
} from './changement/corriger/corrigerChangementReprésentantLégal.behavior';

export type ReprésentantLégalEvent =
  | Lauréat.ReprésentantLégal.ReprésentantLégalImportéEvent
  | Lauréat.ReprésentantLégal.ReprésentantLégalModifiéEvent
  | Lauréat.ReprésentantLégal.ChangementReprésentantLégalDemandéEvent
  | Lauréat.ReprésentantLégal.ChangementReprésentantLégalCorrigéEvent
  | Lauréat.ReprésentantLégal.ChangementReprésentantLégalAccordéEvent
  | Lauréat.ReprésentantLégal.ChangementReprésentantLégalRejetéEvent
  | Lauréat.ReprésentantLégal.ChangementReprésentantLégalSuppriméEvent
  | Lauréat.ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent;

export type ReprésentantLégalAggregate = Aggregate<ReprésentantLégalEvent> & {
  représentantLégal: {
    nom: string;
    type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;
  };

  demande?: {
    statut: StatutChangementReprésentantLégal.ValueType;
    nom: string;
    type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
    demandéLe: DateTime.ValueType;

    accord?: {
      nom: string;
      type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;
      accordéLe: DateTime.ValueType;
    };
    rejet?: {
      rejetéLe: DateTime.ValueType;
    };
  };

  readonly importer: typeof importer;
  readonly modifier: typeof modifier;
  readonly demander: typeof demander;
  readonly annuler: typeof annuler;
  readonly corriger: typeof corriger;
  readonly accorder: typeof accorder;
  readonly rejeter: typeof rejeter;
  readonly supprimer: typeof supprimer;
};

export const getDefaultReprésentantLégalAggregate: GetDefaultAggregateState<
  ReprésentantLégalAggregate,
  ReprésentantLégalEvent
> = () => ({
  apply,
  représentantLégal: {
    nom: '',
    type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.inconnu,
  },
  importer,
  modifier,
  demander,
  annuler,
  corriger,
  accorder,
  rejeter,
  supprimer,
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
    .with({ type: 'ChangementReprésentantLégalAnnulé-V1' }, (event) =>
      applyChangementReprésentantLégalAnnulé.bind(this)(event),
    )
    .with({ type: 'ChangementReprésentantLégalCorrigé-V1' }, (event) =>
      applyChangementReprésentantLégalCorrigé.bind(this)(event),
    )
    .with({ type: 'ChangementReprésentantLégalAccordé-V1' }, (event) =>
      applyChangementReprésentantLégalAccordé.bind(this)(event),
    )
    .with({ type: 'ChangementReprésentantLégalRejeté-V1' }, (event) =>
      applyChangementReprésentantLégalRejeté.bind(this)(event),
    )
    .with({ type: 'ChangementReprésentantLégalSupprimé-V1' }, (event) =>
      applyChangementReprésentantLégalSupprimé.bind(this)(event),
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
