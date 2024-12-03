import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadActionnaireFactory } from '../actionnaire.aggregate';

export type ImporterActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.ImporterActionnaire',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    importéLe: DateTime.ValueType;
  }
>;

export const registerImporterActionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);

  const handler: MessageHandler<ImporterActionnaireCommand> = async ({
    identifiantProjet,
    importéLe,
  }) => {
    const { sociétéMère } = await loadCandidature(identifiantProjet);

    const actionnaire = await loadActionnaire(identifiantProjet, false);

    await actionnaire.importerActionnaire({
      identifiantProjet,
      actionnaire: sociétéMère,
      importéLe,
    });
  };

  mediator.register('Lauréat.Actionnaire.Command.ImporterActionnaire', handler);
};
