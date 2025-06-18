import { IdentifiantProjet } from '@potentiel-domain/common';
import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { StatutChangementActionnaire } from '.';

import { applyActionnaireImporté, importer } from './importer/importerActionnaire.behavior';
import { applyActionnaireModifié, modifier } from './modifier/modifierActionnaire.behavior';
import {
  accorderChangementActionnaire,
  ChangementActionnaireAccordéEvent,
  applyChangementActionnaireAccordé,
} from './changement/accorder/accorderChangementActionnaire.behavior';
import {
  annulerDemandeChangement,
  applyChangementActionnaireAnnulé,
  ChangementActionnaireAnnuléEvent,
} from './changement/annuler/annulerChangementActionnaire.behavior';
import {
  demanderChangement,
  applyChangementActionnaireDemandé,
  ChangementActionnaireDemandéEvent,
} from './changement/demander/demanderChangementActionnaire.behavior';
import {
  applyChangementActionnaireRejeté,
  ChangementActionnaireRejetéEvent,
  rejeterChangementActionnaire,
} from './changement/rejeter/rejeterChangementActionnaire.behavior';
import {
  applyChangementActionnaireEnregistré,
  ChangementActionnaireEnregistréEvent,
  enregistrerChangement,
} from './changement/enregistrerChangement/enregistrerChangement.behavior';
import {
  supprimerDemandeChangement,
  ChangementActionnaireSuppriméEvent,
  applyChangementActionnaireSupprimé,
} from './changement/supprimer/supprimerChangementActionnaire.behavior';

export type ActionnaireEvent =
  | Lauréat.Actionnaire.ActionnaireImportéEvent
  | Lauréat.Actionnaire.ActionnaireModifiéEvent
  | ChangementActionnaireEnregistréEvent
  | ChangementActionnaireDemandéEvent
  | ChangementActionnaireAnnuléEvent
  | ChangementActionnaireAccordéEvent
  | ChangementActionnaireRejetéEvent
  | ChangementActionnaireSuppriméEvent;

export type ActionnaireAggregate = Aggregate<ActionnaireEvent> & {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: string;
  demande?: {
    statut: StatutChangementActionnaire.ValueType;
    nouvelActionnaire: string;
  };
  importer: typeof importer;
  modifier: typeof modifier;
  enregistrerChangement: typeof enregistrerChangement;
  demanderChangement: typeof demanderChangement;
  annulerDemandeChangement: typeof annulerDemandeChangement;
  accorderChangementActionnaire: typeof accorderChangementActionnaire;
  rejeterChangementActionnaire: typeof rejeterChangementActionnaire;
  supprimerDemandeChangement: typeof supprimerDemandeChangement;
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
  enregistrerChangement,
  demanderChangement,
  annulerDemandeChangement,
  accorderChangementActionnaire,
  rejeterChangementActionnaire,
  supprimerDemandeChangement,
});

function apply(this: ActionnaireAggregate, event: ActionnaireEvent) {
  switch (event.type) {
    case 'ActionnaireImporté-V1':
      applyActionnaireImporté.bind(this)(event);
      break;

    case 'ActionnaireModifié-V1':
      applyActionnaireModifié.bind(this)(event);
      break;

    case 'ChangementActionnaireEnregistré-V1':
      applyChangementActionnaireEnregistré.bind(this)(event);
      break;

    case 'ChangementActionnaireDemandé-V1':
      applyChangementActionnaireDemandé.bind(this)(event);
      break;

    case 'ChangementActionnaireAccordé-V1':
      applyChangementActionnaireAccordé.bind(this)(event);
      break;

    case 'ChangementActionnaireAnnulé-V1':
      applyChangementActionnaireAnnulé.bind(this)();
      break;

    case 'ChangementActionnaireRejeté-V1':
      applyChangementActionnaireRejeté.bind(this)();
      break;

    case 'ChangementActionnaireSupprimé-V1':
      applyChangementActionnaireSupprimé.bind(this)(event);
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
