import { DateTime, IdentifiantProjet, Email } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';

import {
  MotifDemandeMainLevéeGarantiesFinancières,
  StatutMainLevéeGarantiesFinancières,
} from '../..';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export type MainLevéeGarantiesFinancièresDemandéeEvent = DomainEvent<
  'MainLevéeGarantiesFinancièresDemandée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    motif: MotifDemandeMainLevéeGarantiesFinancières.RawType;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  motif: MotifDemandeMainLevéeGarantiesFinancières.ValueType;
  demandéLe: DateTime.ValueType;
  demandéPar: Email.ValueType;
};

export async function demanderMainLevée(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, motif, demandéLe, demandéPar }: Options,
) {
  if (!this.actuelles) {
    throw new GarantiesFinancièresNonTrouvéesError();
  }

  const event: MainLevéeGarantiesFinancièresDemandéeEvent = {
    type: 'MainLevéeGarantiesFinancièresDemandée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      motif: motif.statut,
      demandéLe: demandéLe.formatter(),
      demandéPar: demandéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyMainLevéeGarantiesFinancièresDemandée(
  this: GarantiesFinancièresAggregate,
  { payload: { motif, demandéLe, demandéPar } }: MainLevéeGarantiesFinancièresDemandéeEvent,
) {
  this.mainLevée = {
    motif: MotifDemandeMainLevéeGarantiesFinancières.convertirEnValueType(motif),
    statut: StatutMainLevéeGarantiesFinancières.demandé,
    demande: {
      demandéLe: DateTime.convertirEnValueType(demandéLe),
      demandéPar: Email.convertirEnValueType(demandéPar),
    },
  };
}

class GarantiesFinancièresNonTrouvéesError extends InvalidOperationError {
  constructor() {
    super(`Il n'y a pas de garanties fnancières à lever`);
  }
}
