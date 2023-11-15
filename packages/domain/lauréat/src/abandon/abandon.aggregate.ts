import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import * as StatutAbandon from './statutAbandon.valueType';

import {
  AbandonDemandéEvent,
  applyAbandonDemandé,
  demander,
} from './demander/demanderAbandon.behavior';
import {
  ConfirmationAbandonDemandéeEvent,
  applyConfirmationAbandonDemandée,
  demanderConfirmation,
} from './demander/demanderConfirmationAbandon.behavior';
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
import { AucunAbandonEnCours } from './aucunAbandonEnCours.error';
import { annulerRejet } from './annuler/annulerRejetAbandon.behavior';
import {
  transmettrePreuveRecandidature,
  PreuveRecandidatureTransmiseEvent,
  applyPreuveRecandidatureTransmise,
} from './transmettre/transmettrePreuveRecandidatureAbandon.behavior';
import { DocumentProjet } from '@potentiel-domain/document';
import { relancerTransmissionPreuveRecandidature } from './relancer/relancerTransmissionPreuveRecandidatureAbandon.behavior';

export type AbandonEvent =
  | AbandonDemandéEvent
  | AbandonAnnuléEvent
  | AbandonRejetéEvent
  | AbandonAccordéEvent
  | ConfirmationAbandonDemandéeEvent
  | AbandonConfirméEvent
  | PreuveRecandidatureTransmiseEvent;

export type AbandonAggregate = Aggregate<AbandonEvent> & {
  statut: StatutAbandon.ValueType;
  demande: {
    raison: string;
    pièceJustificative?: DocumentProjet.ValueType;
    recandidature: boolean;
    preuveRecandidature?: IdentifiantProjet.ValueType;
    demandéLe: DateTime.ValueType;
    demandéPar: IdentifiantUtilisateur.ValueType;
    confirmation?: {
      réponseSignée: {
        format: string;
      };
      demandéLe: DateTime.ValueType;
      confirméLe?: DateTime.ValueType;
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
  readonly annulerRejet: typeof annulerRejet;
  readonly annuler: typeof annuler;
  readonly confirmer: typeof confirmer;
  readonly demander: typeof demander;
  readonly demanderConfirmation: typeof demanderConfirmation;
  readonly rejeter: typeof rejeter;
  readonly transmettrePreuveRecandidature: typeof transmettrePreuveRecandidature;
  readonly relancerTransmissionPreuveRecandidature: typeof relancerTransmissionPreuveRecandidature;
};

export const getDefaultAbandonAggregate: GetDefaultAggregateState<
  AbandonAggregate,
  AbandonEvent
> = () => ({
  apply,
  statut: StatutAbandon.convertirEnValueType('inconnu'),
  demande: {
    raison: '',
    demandéPar: IdentifiantUtilisateur.convertirEnValueType('unknown-user@unknown-email.com'),
    recandidature: false,
    demandéLe: DateTime.convertirEnValueType(new Date()),
  },
  accorder,
  annuler,
  annulerRejet,
  confirmer,
  demander,
  demanderConfirmation,
  rejeter,
  transmettrePreuveRecandidature,
  relancerTransmissionPreuveRecandidature,
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
      applyAbandonDemandé.bind(this)(event);
      break;
    case 'AbandonRejeté-V1':
      applyAbandonRejeté.bind(this)(event);
      break;
    case 'ConfirmationAbandonDemandée-V1':
      applyConfirmationAbandonDemandée.bind(this)(event);
      break;
    case 'PreuveRecandidatureTransmise-V1':
      applyPreuveRecandidatureTransmise.bind(this)(event);
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
