import { match } from 'ts-pattern';

import { IdentifiantProjet } from '@potentiel-domain/common';
import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';

import { ChangementPuissanceEnregistréEvent, StatutChangementPuissance } from '.';

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
import {
  supprimerDemandeChangement,
  applyChangementPuissanceSupprimé,
  ChangementPuissanceSuppriméEvent,
} from './changement/supprimer/supprimerChangementPuissance.behavior';
import {
  applyChangementPuissanceEnregistré,
  enregistrerChangement,
} from './changement/enregistrerChangement/enregistrerChangementPuissance.behavior';

export type PuissanceEvent =
  | PuissanceImportéeEvent
  | PuissanceModifiéeEvent
  | ChangementPuissanceDemandéEvent
  | ChangementPuissanceAnnuléEvent
  | ChangementPuissanceSuppriméEvent
  | ChangementPuissanceEnregistréEvent;

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
  supprimerDemandeChangement: typeof supprimerDemandeChangement;
  enregistrerChangement: typeof enregistrerChangement;
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
  supprimerDemandeChangement,
  enregistrerChangement,
});

function apply(this: PuissanceAggregate, event: PuissanceEvent) {
  match(event)
    .with({ type: 'PuissanceImportée-V1' }, applyPuissanceImportée.bind(this))
    .with({ type: 'PuissanceModifiée-V1' }, applyPuissanceModifiée.bind(this))
    .with({ type: 'ChangementPuissanceDemandé-V1' }, applyChangementPuissanceDemandé.bind(this))
    .with({ type: 'ChangementPuissanceAnnulé-V1' }, applyChangementPuissanceAnnulé.bind(this))
    .with({ type: 'ChangementPuissanceSupprimé-V1' }, applyChangementPuissanceSupprimé.bind(this))
    .with(
      { type: 'ChangementPuissanceEnregistré-V1' },
      applyChangementPuissanceEnregistré.bind(this),
    )
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
