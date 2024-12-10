import { IdentifiantProjet } from '@potentiel-domain/common';
import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';

import { StatutChangementActionnaire } from '.';

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
  applyChangementActionnaireDemandé,
  demanderChangement,
  ChangementActionnaireDemandéEvent,
} from './demanderChangement/demandeChangementActionnaire.behavior';
import {
  accorderDemandeChangementActionnaire,
  applyDemandeChangementActionnaireAccordée,
  DemandeChangementActionnaireAccordéeEvent,
} from './accorderDemandeChangement/accorderDemandeChangement.behavior';
import {
  annulerDemandeChangement,
  applyDemandeChangementActionnaireAnnulée,
  DemandeChangementActionnaireAnnuléEvent,
} from './annulerDemandeChangement/annulerDemandeChangement.behavior';
import {
  applyDemandeChangementActionnaireRejetée,
  DemandeChangementActionnaireRejetéeEvent,
  rejeterDemandeChangementActionnaire,
} from './rejeterDemandeChangement/rejeterDemandeChangement.behavior';
import {
  ActionnaireTransmisEvent,
  applyActionnaireTransmis,
  transmettre,
} from './transmettre/transmettreActionnaire.behavior';

export type ActionnaireEvent =
  | ActionnaireImportéEvent
  | ActionnaireModifiéEvent
  | ActionnaireTransmisEvent
  | ChangementActionnaireDemandéEvent
  | DemandeChangementActionnaireAnnuléEvent
  | DemandeChangementActionnaireAccordéeEvent
  | DemandeChangementActionnaireRejetéeEvent;

export type ActionnaireAggregate = Aggregate<ActionnaireEvent> & {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: string;
  demande?: {
    statut: StatutChangementActionnaire.ValueType;
    nouvelActionnaire: string;
  };
  importer: typeof importer;
  modifier: typeof modifier;
  transmettre: typeof transmettre;
  demanderChangement: typeof demanderChangement;
  annulerDemandeChangement: typeof annulerDemandeChangement;
  accorderDemandeChangementActionnaire: typeof accorderDemandeChangementActionnaire;
  rejeterDemandeChangementActionnaire: typeof rejeterDemandeChangementActionnaire;
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
  transmettre,
  demanderChangement,
  annulerDemandeChangement,
  accorderDemandeChangementActionnaire,
  rejeterDemandeChangementActionnaire,
});

function apply(this: ActionnaireAggregate, event: ActionnaireEvent) {
  switch (event.type) {
    case 'ActionnaireImporté-V1':
      applyActionnaireImporté.bind(this)(event);
      break;

    case 'ActionnaireModifié-V1':
      applyActionnaireModifié.bind(this)(event);
      break;

    case 'ActionnaireTransmis-V1':
      applyActionnaireTransmis.bind(this)(event);
      break;

    case 'ChangementActionnaireDemandé-V1':
      applyChangementActionnaireDemandé.bind(this)(event);
      break;

    case 'DemandeChangementActionnaireAccordée-V1':
      applyDemandeChangementActionnaireAccordée.bind(this)(event);
      break;

    case 'DemandeChangementActionnaireAnnulée-V1':
      applyDemandeChangementActionnaireAnnulée.bind(this)();
      break;

    case 'DemandeChangementActionnaireRejetée-V1':
      applyDemandeChangementActionnaireRejetée.bind(this)();
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
