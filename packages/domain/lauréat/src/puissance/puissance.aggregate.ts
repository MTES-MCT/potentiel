import { match } from 'ts-pattern';

import { IdentifiantProjet } from '@potentiel-domain/common';
import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';

import { StatutChangementPuissance } from '.';

import { applyPuissanceImportée, importer } from './importer/importerPuissance.behavior';
import { PuissanceImportéeEvent } from './importer/importerPuissance.behavior';
import {
  applyPuissanceModifiée,
  modifier,
  PuissanceModifiéeEvent,
} from './modifier/modifierPuissance.behavior';
import {
  applyChangementPuissanceDemandé,
  ChangementPuissanceDemandéEvent,
  demanderChangement,
} from './changement/demander/demanderChangementPuissance.behavior';
import {
  annulerDemandeChangement,
  applyChangementPuissanceAnnulé,
  ChangementPuissanceAnnuléEvent,
} from './changement/annuler/annulerChangementPuissance.behavior';

export type PuissanceEvent =
  | PuissanceImportéeEvent
  | PuissanceModifiéeEvent
  | ChangementPuissanceDemandéEvent
  | ChangementPuissanceAnnuléEvent;

export type PuissanceAggregate = Aggregate<PuissanceEvent> & {
  identifiantProjet: IdentifiantProjet.ValueType;
  puissance: number;
  demande?: {
    statut: StatutChangementPuissance.ValueType;
    nouvellePuissance: number;
  };
  importer: typeof importer;
  modifier: typeof modifier;
  demanderChangement: typeof demanderChangement;
  annulerDemandeChangement: typeof annulerDemandeChangement;
};

export const getDefaultPuissanceAggregate: GetDefaultAggregateState<
  PuissanceAggregate,
  PuissanceEvent
> = () => ({
  identifiantProjet: IdentifiantProjet.inconnu,
  puissance: 0,
  apply,
  importer,
  modifier,
  demanderChangement,
  annulerDemandeChangement,
});

function apply(this: PuissanceAggregate, event: PuissanceEvent) {
  match(event)
    .with({ type: 'PuissanceImportée-V1' }, applyPuissanceImportée.bind(this))
    .with({ type: 'PuissanceModifiée-V1' }, applyPuissanceModifiée.bind(this))
    .with({ type: 'ChangementPuissanceDemandé-V1' }, applyChangementPuissanceDemandé.bind(this))
    .with({ type: 'ChangementPuissanceAnnulé-V1' }, applyChangementPuissanceAnnulé.bind(this))
    .exhaustive();
}

export const loadPuissanceFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `puissance|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultPuissanceAggregate,
      onNone: throwOnNone
        ? () => {
            throw new PuissanceNonTrouvéeError();
          }
        : undefined,
    });
  };

class PuissanceNonTrouvéeError extends AggregateNotFoundError {
  constructor() {
    super(`La puissance n'existe pas`);
  }
}
