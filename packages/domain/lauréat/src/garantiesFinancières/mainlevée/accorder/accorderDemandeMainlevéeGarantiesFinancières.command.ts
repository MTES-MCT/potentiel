import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type AccorderDemandeMainlevéeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Command.AccorderDemandeMainlevée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    accordéLe: DateTime.ValueType;
    accordéPar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registeAccorderDemandeMainlevéeGarantiesFinancièresCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);

  const handler: MessageHandler<AccorderDemandeMainlevéeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.accorderDemandeMainlevéeGarantiesFinancières({
      identifiantProjet,
      accordéLe,
      accordéPar,
      réponseSignée,
    });
    // Temporaire : le load doit être fait après pour que l'aggrégat soit à jour
    const projet = await getProjetAggregateRoot(identifiantProjet);
    // TODO move to Garanties Financière Aggregate
    await projet.lauréat.garantiesFinancières.annulerTâchesPlanififées();
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Mainlevée.Command.AccorderDemandeMainlevée',
    handler,
  );
};
