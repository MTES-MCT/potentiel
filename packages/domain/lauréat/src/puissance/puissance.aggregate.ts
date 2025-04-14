import { match } from 'ts-pattern';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';

import { AutoritéCompétente, StatutChangementPuissance } from '.';

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
import {
  applyChangementPuissanceEnregistré,
  ChangementPuissanceEnregistréEvent,
  enregistrerChangement,
} from './changement/enregistrerChangement/enregistrerChangementPuissance.behavior';
import { PuissanceIntrouvableError } from './errors';
import {
  applyChangementPuissanceRejeté,
  ChangementPuissanceRejetéEvent,
  rejeterDemandeChangement,
} from './changement/rejeter/rejeterChangementPuissance.behavior';

export type PuissanceEvent =
  | PuissanceImportéeEvent
  | PuissanceModifiéeEvent
  | ChangementPuissanceDemandéEvent
  | ChangementPuissanceAnnuléEvent
  | ChangementPuissanceSuppriméEvent
  | ChangementPuissanceEnregistréEvent
  | ChangementPuissanceAccordéEvent
  | ChangementPuissanceRejetéEvent;

export type PuissanceAggregate = Aggregate<PuissanceEvent> & {
  identifiantProjet: IdentifiantProjet.ValueType;
  puissance: number;
  demande?: {
    statut: StatutChangementPuissance.ValueType;
    nouvellePuissance: number;
    autoritéCompétente?: AutoritéCompétente.RawType;
  };

  readonly importer: typeof importer;
  readonly modifier: typeof modifier;
  readonly demanderChangement: typeof demanderChangement;
  readonly annulerDemandeChangement: typeof annulerDemandeChangement;
  readonly supprimerDemandeChangement: typeof supprimerDemandeChangement;
  readonly accorderDemandeChangement: typeof accorderDemandeChangement;
  readonly rejeterDemandeChangement: typeof rejeterDemandeChangement;
  readonly enregistrerChangement: typeof enregistrerChangement;
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
  enregistrerChangement,
  rejeterDemandeChangement,
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
    .with({ type: 'ChangementPuissanceAccordé-V1' }, applyChangementPuissanceAccordé.bind(this))
    .with({ type: 'ChangementPuissanceRejeté-V1' }, applyChangementPuissanceRejeté.bind(this))
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
            throw new PuissanceIntrouvableError();
          }
        : undefined,
    });
  };
