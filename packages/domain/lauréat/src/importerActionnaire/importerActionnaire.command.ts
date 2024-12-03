// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { LoadAggregate } from '@potentiel-domain/core';

import { Lauréat } from '..';

export type ImporterActionnaireCommand = Message<
  'Lauréat.Command.ImporterActionnaire',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    actionnaire: String;
    importéLe: DateTime.ValueType;
  }
>;

// question : vérification sur actionnaire pour la demande ?

export const registerImporterActionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadLauréat = Lauréat.loadLauréatFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);

  const handler: MessageHandler<ImporterActionnaireCommand> = async ({
    identifiantProjet,
    importéLe,
  }) => {
    const { sociétéMère } = await loadCandidature(identifiantProjet);

    const lauréat = await loadLauréat(identifiantProjet);

    await lauréat.importerActionnaire({
      identifiantProjet,
      actionnaire: sociétéMère,
      importéLe,
    });
  };

  mediator.register('Lauréat.Command.ImporterActionnaire', handler);
};
