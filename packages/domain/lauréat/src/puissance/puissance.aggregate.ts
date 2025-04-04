import { match } from 'ts-pattern';

import { IdentifiantProjet } from '@potentiel-domain/common';
import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';

import { RatioChangementPuissance, StatutChangementPuissance } from '.';

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
  accorderDemandeChangement,
  applyChangementPuissanceAccordé,
  ChangementPuissanceAccordéEvent,
} from './changement/accorder/accorderChangementPuissance.behavior';

export type PuissanceEvent =
  | PuissanceImportéeEvent
  | PuissanceModifiéeEvent
  | ChangementPuissanceDemandéEvent
  | ChangementPuissanceAnnuléEvent
  | ChangementPuissanceSuppriméEvent
  | ChangementPuissanceAccordéEvent;

export type PuissanceAggregate = Aggregate<PuissanceEvent> & {
  identifiantProjet: IdentifiantProjet.ValueType;
  puissance: number;
  demande?: {
    statut: StatutChangementPuissance.ValueType;
    nouvellePuissance: number;
    autoritéCompétente?: RatioChangementPuissance.AutoritéCompétente;
  };

  readonly importer: typeof importer;
  readonly modifier: typeof modifier;
  readonly demanderChangement: typeof demanderChangement;
  readonly annulerDemandeChangement: typeof annulerDemandeChangement;
  readonly supprimerDemandeChangement: typeof supprimerDemandeChangement;
  readonly accorderDemandeChangement: typeof accorderDemandeChangement;
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
  accorderDemandeChangement,
});

function apply(this: PuissanceAggregate, event: PuissanceEvent) {
  match(event)
    .with({ type: 'PuissanceImportée-V1' }, applyPuissanceImportée.bind(this))
    .with({ type: 'PuissanceModifiée-V1' }, applyPuissanceModifiée.bind(this))
    .with({ type: 'ChangementPuissanceDemandé-V1' }, applyChangementPuissanceDemandé.bind(this))
    .with({ type: 'ChangementPuissanceAnnulé-V1' }, applyChangementPuissanceAnnulé.bind(this))
    .with({ type: 'ChangementPuissanceSupprimé-V1' }, applyChangementPuissanceSupprimé.bind(this))
    .with({ type: 'ChangementPuissanceAccordé-V1' }, applyChangementPuissanceAccordé.bind(this))
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
