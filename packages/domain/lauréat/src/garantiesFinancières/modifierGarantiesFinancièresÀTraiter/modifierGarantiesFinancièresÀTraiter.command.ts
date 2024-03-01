import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { LoadAggregate } from '@potentiel-domain/core';
import { TypeGarantiesFinancières } from '..';
import { loadGarantiesFinancièresFactory } from '../garantiesFinancières.aggregate';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

export type ModifierGarantiesFinancièresÀTraiterCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancièresÀTraiter',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
    dateConstitution: DateTime.ValueType;
    soumisLe: DateTime.ValueType;
    soumisPar: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerModifierGarantiesFinancièresÀTraiterCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<ModifierGarantiesFinancièresÀTraiterCommand> = async ({
    identifiantProjet,
    attestation,
    dateConstitution,
    soumisLe,
    type,
    dateÉchéance,
    soumisPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.modifierGarantiesFinancièresÀTraiter({
      identifiantProjet,
      attestation,
      dateConstitution,
      soumisLe,
      type,
      dateÉchéance,
      soumisPar,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancièresÀTraiter',
    handler,
  );
};
