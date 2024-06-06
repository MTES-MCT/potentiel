import { IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export type MainLevéeGarantiesFinancièresAnnuléeEvent = DomainEvent<
  'MainLevéeGarantiesFinancièresAnnulée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function annulerMainLevée(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet }: Options,
) {
  console.log('coucou', this);

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

  const event: MainLevéeGarantiesFinancièresAnnuléeEvent = {
    type: 'MainLevéeGarantiesFinancièresAnnulée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
    },
  };

  await this.publish(event);
}

export function applyMainLevéeGarantiesFinancièresAnnulée(this: GarantiesFinancièresAggregate) {
  this.mainLevée = undefined;
}

class MainLevéeNonTrouvéeError extends InvalidOperationError {
  constructor() {
    super("Il n'y a pas de main levée demandée pour ce projet");
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
