import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type SupprimerDépôtGarantiesFinancièresEnCoursCommand = Message<
  'Lauréat.GarantiesFinancières.Command.SupprimerDépôtGarantiesFinancièresEnCours',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    suppriméLe: DateTime.ValueType;
    suppriméPar: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerSupprimerDépôtGarantiesFinancièresEnCoursCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<SupprimerDépôtGarantiesFinancièresEnCoursCommand> = async ({
    identifiantProjet,
    suppriméLe,
    suppriméPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.supprimerDépôtGarantiesFinancièresEnCours({
      identifiantProjet,
      suppriméLe,
      suppriméPar,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.SupprimerDépôtGarantiesFinancièresEnCours',
    handler,
  );
};
