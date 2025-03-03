import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';

import * as StatutAbandon from './statutAbandon.valueType';
import {
  AbandonDemandéEvent,
  AbandonDemandéEventV1,
  applyAbandonDemandé,
  demander,
} from './demander/demanderAbandon.behavior';
import {
  ConfirmationAbandonDemandéeEvent,
  applyConfirmationAbandonDemandée,
  demanderConfirmation,
} from './demanderConfirmation/demanderConfirmationAbandon.behavior';
import { AbandonRejetéEvent, applyAbandonRejeté, rejeter } from './rejeter/rejeterAbandon.behavior';
import {
  AbandonAccordéEvent,
  accorder,
  applyAbandonAccordé,
} from './accorder/accorderAbandon.behavior';
import { AbandonAnnuléEvent, annuler, applyAbandonAnnulé } from './annuler/annulerAbandon.behavior';
import {
  AbandonConfirméEvent,
  applyAbandonConfirmé,
  confirmer,
} from './confirmer/confirmerAbandon.behavior';
import {
  transmettrePreuveRecandidature,
  PreuveRecandidatureTransmiseEvent,
  applyPreuveRecandidatureTransmise,
} from './transmettre/transmettrePreuveRecandidatureAbandon.behavior';
import {
  PreuveRecandidatureDemandéeEvent,
  applyPreuveRecandidatureDemandée,
  demanderPreuveRecandidature,
} from './demanderPreuveRecandidature/demanderPreuveRecandidatureAbandon.behavior';
import {
  AbandonInstruitEvent,
  applyAbandonInstruit,
  instruire,
} from './instruire/instruireAbandon.behavior';

export type AbandonEvent =
  | AbandonDemandéEventV1
  | AbandonDemandéEvent
  | AbandonAnnuléEvent
  | AbandonRejetéEvent
  | AbandonAccordéEvent
  | ConfirmationAbandonDemandéeEvent
  | AbandonConfirméEvent
  | PreuveRecandidatureTransmiseEvent
  | PreuveRecandidatureDemandéeEvent
  | AbandonInstruitEvent;

export type AbandonAggregate = Aggregate<AbandonEvent> & {
  statut: StatutAbandon.ValueType;
  demande: {
    raison: string;
    pièceJustificative?: DocumentProjet.ValueType;
    recandidature: boolean;
    preuveRecandidature?: IdentifiantProjet.ValueType;
    preuveRecandidatureDemandéeLe?: DateTime.ValueType;
    preuveRecandidatureTransmiseLe?: DateTime.ValueType;
    preuveRecandidatureTransmisePar?: IdentifiantUtilisateur.ValueType;
    demandéLe: DateTime.ValueType;
    demandéPar: IdentifiantUtilisateur.ValueType;
    confirmation?: {
      réponseSignée: {
        format: string;
      };
      demandéLe: DateTime.ValueType;
      confirméLe?: DateTime.ValueType;
    };
    // viovio à voir
    // instruction?: {
    //   demandéLe: DateTime.ValueType;
    //   confirméLe?: DateTime.ValueType;
    // };
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
  readonly confirmer: typeof confirmer;
  readonly demander: typeof demander;
  readonly demanderConfirmation: typeof demanderConfirmation;
  readonly rejeter: typeof rejeter;
  readonly instruire: typeof instruire;
  readonly transmettrePreuveRecandidature: typeof transmettrePreuveRecandidature;
  readonly demanderPreuveRecandidature: typeof demanderPreuveRecandidature;
  readonly estAccordé: () => boolean;
};

export const getDefaultAbandonAggregate: GetDefaultAggregateState<
  AbandonAggregate,
  AbandonEvent
> = () => ({
  apply,
  statut: StatutAbandon.convertirEnValueType('inconnu'),
  demande: {
    raison: '',
    demandéPar: IdentifiantUtilisateur.unknownUser,
    recandidature: false,
    demandéLe: DateTime.convertirEnValueType(new Date()),
  },
  accorder,
  annuler,
  confirmer,
  demander,
  demanderConfirmation,
  rejeter,
  instruire,
  transmettrePreuveRecandidature,
  demanderPreuveRecandidature,
  estAccordé() {
    return this.statut.estAccordé();
  },
});

function apply(this: AbandonAggregate, event: AbandonEvent) {
  switch (event.type) {
    case 'AbandonAccordé-V1':
      applyAbandonAccordé.bind(this)(event);
      break;
    case 'AbandonAnnulé-V1':
      applyAbandonAnnulé.bind(this)(event);
      break;
    case 'AbandonConfirmé-V1':
      applyAbandonConfirmé.bind(this)(event);
      break;
    case 'AbandonDemandé-V1':
    case 'AbandonDemandé-V2':
      applyAbandonDemandé.bind(this)(event);
      break;
    case 'AbandonRejeté-V1':
      applyAbandonRejeté.bind(this)(event);
      break;
    case 'AbandonInstruit-V1':
      applyAbandonInstruit.bind(this)(event);
      break;
    case 'ConfirmationAbandonDemandée-V1':
      applyConfirmationAbandonDemandée.bind(this)(event);
      break;
    case 'PreuveRecandidatureTransmise-V1':
      applyPreuveRecandidatureTransmise.bind(this)(event);
      break;
    case 'PreuveRecandidatureDemandée-V1':
      applyPreuveRecandidatureDemandée.bind(this)(event);
      break;
  }
}

export const loadAbandonFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `abandon|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultAbandonAggregate,
      onNone: throwOnNone
        ? () => {
            throw new AucunAbandonEnCours();
          }
        : undefined,
    });
  };

class AucunAbandonEnCours extends AggregateNotFoundError {
  constructor() {
    super(`Aucun abandon n'est en cours`);
  }
}
