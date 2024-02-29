import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { LoadAggregate } from '@potentiel-domain/core';
import { loadGarantiesFinancièresFactory } from '../garantiesFinancières.aggregate';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

export type SupprimerGarantiesFinancièresÀTraiterCommand = Message<
  'Lauréat.GarantiesFinancières.Command.SupprimerGarantiesFinancièresÀTraiter',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    suppriméLe: DateTime.ValueType;
    suppriméPar: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerSupprimerGarantiesFinancièresÀTraiterCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<SupprimerGarantiesFinancièresÀTraiterCommand> = async ({
    identifiantProjet,
    suppriméLe,
    suppriméPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.supprimerGarantiesFinancièresÀTraiter({
      identifiantProjet,
      suppriméLe,
      suppriméPar,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.SupprimerGarantiesFinancièresÀTraiter',
    handler,
  );
};
