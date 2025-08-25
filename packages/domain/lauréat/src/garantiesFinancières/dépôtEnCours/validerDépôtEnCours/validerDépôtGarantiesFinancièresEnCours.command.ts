import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type ValiderDépôtGarantiesFinancièresEnCoursCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ValiderDépôtGarantiesFinancièresEnCours',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    validéLe: DateTime.ValueType;
    validéPar: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerValiderDépôtGarantiesFinancièresEnCoursCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<ValiderDépôtGarantiesFinancièresEnCoursCommand> = async ({
    identifiantProjet,
    validéLe,
    validéPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
    await garantiesFinancières.validerDépôtEnCours({
      identifiantProjet,
      validéLe,
      validéPar,
    });
    // Temporaire : le load doit être fait après pour que l'aggrégat soit à jour
    const projet = await getProjetAggregateRoot(identifiantProjet);
    // TODO move to Garanties Financière Aggregate
    await projet.lauréat.garantiesFinancières.ajouterTâchesPlanifiéesÉchéance();
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.ValiderDépôtGarantiesFinancièresEnCours',
    handler,
  );
};
