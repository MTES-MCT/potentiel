import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

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
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<SupprimerDépôtGarantiesFinancièresEnCoursCommand> = async ({
    identifiantProjet,
    suppriméLe,
    suppriméPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await garantiesFinancières.supprimerDépôtGarantiesFinancièresEnCours({
      identifiantProjet,
      suppriméLe,
      suppriméPar,
    });
    // TODO move to Garanties Financière Aggregate
    await projet.lauréat.garantiesFinancières.ajouterTâchesPlanifiées();
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.SupprimerDépôtGarantiesFinancièresEnCours',
    handler,
  );
};
