import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import {
  applyConfirmationAbandonDemandée,
  demanderConfirmation,
} from './demanderConfirmation/demanderConfirmationAbandon.behavior';
import { applyAbandonRejeté, rejeter } from './rejeter/rejeterAbandon.behavior';
import { annuler, applyAbandonAnnulé } from './annuler/annulerAbandon.behavior';
import {
  AbandonConfirméEvent,
  applyAbandonConfirmé,
  confirmer,
} from './confirmer/confirmerAbandon.behavior';
import { applyPreuveRecandidatureTransmise } from './transmettre/transmettrePreuveRecandidatureAbandon.behavior';
import {
  passerEnInstruction,
  applyAbandonPasséEnInstruction,
} from './instruire/passerAbandonEnInstruction.behavior';

export type AbandonEvent =
  | Lauréat.Abandon.AbandonDemandéEventV1
  | Lauréat.Abandon.AbandonDemandéEvent
  | Lauréat.Abandon.AbandonAnnuléEvent
  | Lauréat.Abandon.AbandonRejetéEvent
  | Lauréat.Abandon.AbandonAccordéEvent
  | Lauréat.Abandon.ConfirmationAbandonDemandéeEvent
  | AbandonConfirméEvent
  | Lauréat.Abandon.PreuveRecandidatureTransmiseEvent
  | Lauréat.Abandon.PreuveRecandidatureDemandéeEvent
  | Lauréat.Abandon.AbandonPasséEnInstructionEvent;

export type AbandonAggregate = Aggregate<AbandonEvent> & {
  statut: Lauréat.Abandon.StatutAbandon.ValueType;
  demande: {
    raison: string;
    pièceJustificative?: DocumentProjet.ValueType;
    recandidature: boolean;
    preuveRecandidature?: IdentifiantProjet.ValueType;
    preuveRecandidatureTransmiseLe?: DateTime.ValueType;
    preuveRecandidatureTransmisePar?: IdentifiantUtilisateur.ValueType;
    demandéLe: DateTime.ValueType;
    demandéPar: IdentifiantUtilisateur.ValueType;
    instruction?: {
      démarréLe: DateTime.ValueType;
      instruitPar: Email.ValueType;
    };
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
  readonly annuler: typeof annuler;
  readonly confirmer: typeof confirmer;
  readonly demanderConfirmation: typeof demanderConfirmation;
  readonly rejeter: typeof rejeter;
  readonly passerEnInstruction: typeof passerEnInstruction;
  readonly estAccordé: () => boolean;
};

export const getDefaultAbandonAggregate: GetDefaultAggregateState<
  AbandonAggregate,
  AbandonEvent
> = () => ({
  apply,
  statut: Lauréat.Abandon.StatutAbandon.inconnu,
  demande: {
    raison: '',
    demandéPar: IdentifiantUtilisateur.unknownUser,
    recandidature: false,
    demandéLe: DateTime.convertirEnValueType(new Date()),
    passéEnInstructionPar: IdentifiantUtilisateur.unknownUser,
  },
  annuler,
  confirmer,
  demanderConfirmation,
  rejeter,
  passerEnInstruction,
  estAccordé() {
    return this.statut.estAccordé();
  },
});

function apply(this: AbandonAggregate, event: AbandonEvent) {
  switch (event.type) {
    case 'AbandonAccordé-V1':
      this.statut = Lauréat.Abandon.StatutAbandon.accordé;
      break;
    case 'AbandonAnnulé-V1':
      applyAbandonAnnulé.bind(this)(event);
      break;
    case 'AbandonConfirmé-V1':
      applyAbandonConfirmé.bind(this)(event);
      break;
    case 'AbandonDemandé-V1':
      this.statut = Lauréat.Abandon.StatutAbandon.demandé;
      this.demande.recandidature = event.payload.recandidature;
      break;
    case 'AbandonDemandé-V2':
      this.statut = Lauréat.Abandon.StatutAbandon.demandé;
      break;
    case 'AbandonRejeté-V1':
      applyAbandonRejeté.bind(this)(event);
      break;
    case 'AbandonPasséEnInstruction-V1':
      applyAbandonPasséEnInstruction.bind(this)(event);
      break;
    case 'ConfirmationAbandonDemandée-V1':
      applyConfirmationAbandonDemandée.bind(this)(event);
      break;
    case 'PreuveRecandidatureTransmise-V1':
      applyPreuveRecandidatureTransmise.bind(this)(event);
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
