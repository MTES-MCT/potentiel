import { DateTime, IdentifiantProjet, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { DemandeMainlevéeNonTrouvéeError } from '../demandeMainlevéeNonTrouvée.error';
import { StatutMainlevéeGarantiesFinancières } from '../..';

export type InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent = DomainEvent<
  'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    démarréLe: DateTime.RawType;
    démarréPar: Email.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  démarréLe: DateTime.ValueType;
  démarréPar: Email.ValueType;
};

export async function démarrerInstructionDemandeMainlevée(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, démarréLe, démarréPar }: Options,
) {
  if (!this.demandeMainlevéeEnCours) {
    throw new DemandeMainlevéeNonTrouvéeError();
  }

  this.demandeMainlevéeEnCours.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutMainlevéeGarantiesFinancières.enInstruction,
  );

  const event: InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent = {
    type: 'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      démarréLe: démarréLe.formatter(),
      démarréPar: démarréPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyInstructionDemandeMainlevéeGarantiesFinancièresDémarrée(
  this: GarantiesFinancièresAggregate,
  _: InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent,
) {
  if (this.demandeMainlevéeEnCours) {
    this.demandeMainlevéeEnCours.statut = StatutMainlevéeGarantiesFinancières.enInstruction;
  } else {
    this.demandeMainlevéeEnCours = { statut: StatutMainlevéeGarantiesFinancières.enInstruction };
  }
}
