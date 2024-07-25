import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export type DemandeMainlevéeGarantiesFinancièresAnnuléeEvent = DomainEvent<
  'DemandeMainlevéeGarantiesFinancièresAnnulée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    annuléLe: DateTime.RawType;
    annuléPar: Email.RawType;
  }
>;

type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  annuléLe: DateTime.ValueType;
  annuléPar: Email.ValueType;
};

export async function annulerDemandeMainlevée(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, annuléLe, annuléPar }: Options,
) {
  if (!this.demandeMainlevéeEnCours) {
    throw new MainlevéeNonTrouvéeError();
  }

  if (this.demandeMainlevéeEnCours?.statut.estAccordé()) {
    throw new MainlevéeDéjàAccordéeError();
  }

  if (this.demandeMainlevéeEnCours?.statut.estRejeté()) {
    throw new MainlevéeDéjàRejetéeError();
  }

  if (this.demandeMainlevéeEnCours?.statut.estEnInstruction()) {
    throw new MainlevéeEnInstructionError();
  }

  /*
  Pour le moment les champs d'annulation ne sont pas utilisés
  Mais l'historique est enregistré au cas où
  */
  const event: DemandeMainlevéeGarantiesFinancièresAnnuléeEvent = {
    type: 'DemandeMainlevéeGarantiesFinancièresAnnulée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      annuléLe: annuléLe.formatter(),
      annuléPar: annuléPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyDemandeMainlevéeGarantiesFinancièresAnnulée(
  this: GarantiesFinancièresAggregate,
  _: DemandeMainlevéeGarantiesFinancièresAnnuléeEvent,
) {
  this.demandeMainlevéeEnCours = undefined;
}

class MainlevéeNonTrouvéeError extends InvalidOperationError {
  constructor() {
    super("Il n'y a pas de demande de mainlevée pour ce projet");
  }
}

class MainlevéeDéjàAccordéeError extends InvalidOperationError {
  constructor() {
    super('La demande de mainlevée a déjà été accordée');
  }
}

class MainlevéeDéjàRejetéeError extends InvalidOperationError {
  constructor() {
    super('La demande de mainlevée a déjà été rejetée');
  }
}

class MainlevéeEnInstructionError extends InvalidOperationError {
  constructor() {
    super('La demande de mainlevée est en instruction');
  }
}
