import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { loadActionnaireFactory } from '../actionnaire.aggregate';

export type ImporterActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.ImporterActionnaire',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    importéLe: DateTime.ValueType;
  }
>;

export const registerImporterActionnaireCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);

  const handler: MessageHandler<ImporterActionnaireCommand> = async ({
    identifiantProjet,
    importéLe,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    projet.lauréat.vérifierQueLeLauréatExiste();
    const { sociétéMère } = projet.candidature;

    const actionnaire = await loadActionnaire(identifiantProjet, false);

    await actionnaire.importer({
      identifiantProjet,
      actionnaire: sociétéMère,
      importéLe,
    });
  };

  mediator.register('Lauréat.Actionnaire.Command.ImporterActionnaire', handler);
};
