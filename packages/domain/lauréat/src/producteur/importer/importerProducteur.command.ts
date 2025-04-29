import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { loadProducteurFactory } from '../producteur.aggregate';

export type ImporterProducteurCommand = Message<
  'Lauréat.Producteur.Command.ImporterProducteur',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    importéLe: DateTime.ValueType;
  }
>;

export const registerImporterProducteurCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadProducteur = loadProducteurFactory(loadAggregate);

  const handler: MessageHandler<ImporterProducteurCommand> = async ({
    identifiantProjet,
    importéLe,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    projet.lauréat.vérifierQueLeLauréatExiste();
    const { sociétéMère } = projet.candidature;

    const producteur = await loadProducteur(identifiantProjet, false);

    await producteur.importer({
      identifiantProjet,
      producteur: sociétéMère,
      importéLe,
    });
  };

  mediator.register('Lauréat.Producteur.Command.ImporterProducteur', handler);
};
