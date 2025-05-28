import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { Lauréat } from '@potentiel-domain/projet';

import { applyConfirmationAbandonDemandée } from './demanderConfirmation/demanderConfirmationAbandon.behavior';
import { applyAbandonRejeté, rejeter } from './rejeter/rejeterAbandon.behavior';
import { annuler, applyAbandonAnnulé } from './annuler/annulerAbandon.behavior';
import { applyAbandonConfirmé, confirmer } from './confirmer/confirmerAbandon.behavior';
import { applyPreuveRecandidatureTransmise } from './transmettre/transmettrePreuveRecandidatureAbandon.behavior';
import {
  passerEnInstruction,
  applyAbandonPasséEnInstruction,
} from './instruire/passerAbandonEnInstruction.behavior';

export type AbandonAggregate = Aggregate<Lauréat.Abandon.AbandonEvent> & {
  statut: Lauréat.Abandon.StatutAbandon.ValueType;
  demande: {
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
  readonly rejeter: typeof rejeter;
  readonly passerEnInstruction: typeof passerEnInstruction;
};

export const getDefaultAbandonAggregate: GetDefaultAggregateState<
  AbandonAggregate,
  Lauréat.Abandon.AbandonEvent
> = () => ({
  apply,
  statut: Lauréat.Abandon.StatutAbandon.inconnu,
  demande: {
    demandéPar: IdentifiantUtilisateur.unknownUser,
    recandidature: false,
    demandéLe: DateTime.convertirEnValueType(new Date()),
    passéEnInstructionPar: IdentifiantUtilisateur.unknownUser,
  },
  annuler,
  confirmer,
  rejeter,
  passerEnInstruction,
});

function apply(this: AbandonAggregate, event: Lauréat.Abandon.AbandonEvent) {
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
