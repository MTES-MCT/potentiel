import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';
import { Email } from '@potentiel-domain/common';

import * as StatutRecours from './statutRecours.valueType';
import {
  RecoursDemandéEvent,
  applyRecoursDemandé,
  demander,
} from './demander/demanderRecours.behavior';
import { RecoursRejetéEvent, applyRecoursRejeté, rejeter } from './rejeter/rejeterRecours.behavior';
import {
  RecoursAccordéEvent,
  accorder,
  applyRecoursAccordé,
} from './accorder/accorderRecours.behavior';
import { RecoursAnnuléEvent, annuler, applyRecoursAnnulé } from './annuler/annulerRecours.behavior';
import {
  applyRecoursPasséEnInstruction,
  passerEnInstruction,
  RecoursPasséEnInstructionEvent,
} from './instruire/passerRecoursEnInstruction.behavior';

export type RecoursEvent =
  | RecoursDemandéEvent
  | RecoursAnnuléEvent
  | RecoursRejetéEvent
  | RecoursAccordéEvent
  | RecoursPasséEnInstructionEvent;

export type RecoursAggregate = Aggregate<RecoursEvent> & {
  statut: StatutRecours.ValueType;
  demande: {
    raison: string;
    pièceJustificative?: DocumentProjet.ValueType;
    demandéLe: DateTime.ValueType;
    demandéPar: IdentifiantUtilisateur.ValueType;
    instruction?: {
      démarréLe: DateTime.ValueType;
      par: Email.ValueType;
    };
  };
  rejet?: {
    rejetéLe: DateTime.ValueType;
    réponseSignée: {
      format: string;
    };
  };
  accord?: {
    accordéLe: DateTime.ValueType;
    réponseSignée: {
      format: string;
    };
  };
  annuléLe?: DateTime.ValueType;
  readonly accorder: typeof accorder;
  readonly annuler: typeof annuler;
  readonly demander: typeof demander;
  readonly rejeter: typeof rejeter;
  readonly passerEnInstruction: typeof passerEnInstruction;
};

export const getDefaultRecoursAggregate: GetDefaultAggregateState<
  RecoursAggregate,
  RecoursEvent
> = () => ({
  apply,
  statut: StatutRecours.convertirEnValueType('inconnu'),
  demande: {
    raison: '',
    demandéPar: IdentifiantUtilisateur.unknownUser,
    demandéLe: DateTime.convertirEnValueType(new Date()),
  },
  accorder,
  annuler,
  demander,
  rejeter,
  passerEnInstruction,
});

function apply(this: RecoursAggregate, event: RecoursEvent) {
  switch (event.type) {
    case 'RecoursAccordé-V1':
      applyRecoursAccordé.bind(this)(event);
      break;
    case 'RecoursAnnulé-V1':
      applyRecoursAnnulé.bind(this)(event);
      break;
    case 'RecoursDemandé-V1':
      applyRecoursDemandé.bind(this)(event);
      break;
    case 'RecoursRejeté-V1':
      applyRecoursRejeté.bind(this)(event);
      break;
    case 'RecoursPasséEnInstruction-V1':
      applyRecoursPasséEnInstruction.bind(this)(event);
      break;
  }
}

export const loadRecoursFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `recours|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultRecoursAggregate,
      onNone: throwOnNone
        ? () => {
            throw new AucunRecoursEnCours();
          }
        : undefined,
    });
  };

class AucunRecoursEnCours extends AggregateNotFoundError {
  constructor() {
    super(`Aucun recours n'est en cours`);
  }
}
