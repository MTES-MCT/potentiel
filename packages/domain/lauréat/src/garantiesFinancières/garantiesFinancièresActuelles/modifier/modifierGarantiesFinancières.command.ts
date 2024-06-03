import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { LoadAggregate } from '@potentiel-domain/core';
import { TypeGarantiesFinancières } from '../..';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type ModifierGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
    dateConstitution: DateTime.ValueType;
    modifiéPar: IdentifiantUtilisateur.ValueType;
    modifiéLe: DateTime.ValueType;
  }
>;

export const registerModifierGarantiesFinancièresCommand = (loadAggregate: LoadAggregate) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<ModifierGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    attestation,
    dateConstitution,
    type,
    dateÉchéance,
    modifiéLe,
    modifiéPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
    await garantiesFinancières.modifier({
      identifiantProjet,
      attestation,
      dateConstitution,
      type,
      dateÉchéance,
      modifiéLe,
      modifiéPar,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancières', handler);
};
