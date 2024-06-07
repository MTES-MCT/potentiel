import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export type MainLevéeGarantiesFinancièresAnnuléeEvent = DomainEvent<
  'MainLevéeGarantiesFinancièresAnnulée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    annulation: {
      annuléLe: DateTime.RawType;
      annuléPar: Email.RawType;
    };
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  annuléLe: DateTime.ValueType;
  annuléPar: Email.ValueType;
};

export async function annulerMainLevée(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, annuléLe, annuléPar }: Options,
) {
  if (!this.mainLevée) {
    throw new MainLevéeNonTrouvéeError();
  }

  if (this.mainLevée?.statut.estAccordé()) {
    throw new MainLevéeDéjàAccordéeError();
  }

  if (this.mainLevée?.statut.estRejeté()) {
    throw new MainLevéeDéjàRejetéeError();
  }

  if (this.mainLevée?.statut.estEnInstruction()) {
    throw new MainLevéeEnInstructionError();
  }

  /*
  Pour le moment le champs annulation n'est pas utilisé
  Mais il pourra l'être dans un second temps et enregistre l'historique
  */
  const event: MainLevéeGarantiesFinancièresAnnuléeEvent = {
    type: 'MainLevéeGarantiesFinancièresAnnulée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      annulation: {
        annuléLe: annuléLe.formatter(),
        annuléPar: annuléPar.formatter(),
      },
    },
  };

  await this.publish(event);
}

export function applyMainLevéeGarantiesFinancièresAnnulée(this: GarantiesFinancièresAggregate) {
  this.mainLevée = undefined;
}

class MainLevéeNonTrouvéeError extends InvalidOperationError {
  constructor() {
    super("Il n'y a pas de main levée annulée pour ce projet");
  }
}

class MainLevéeDéjàAccordéeError extends InvalidOperationError {
  constructor() {
    super('La demande de main-levée a déjà été accordée');
  }
}

class MainLevéeDéjàRejetéeError extends InvalidOperationError {
  constructor() {
    super('La demande de main-levée a déjà été rejetée');
  }
}

class MainLevéeEnInstructionError extends InvalidOperationError {
  constructor() {
    super('La demande de main-levée est en instruction');
  }
}
