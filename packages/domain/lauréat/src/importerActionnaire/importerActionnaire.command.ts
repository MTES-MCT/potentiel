import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { LoadAggregate } from '@potentiel-domain/core';

import { Lauréat } from '..';

export type ImporterActionnaireLauréatCommand = Message<
  'Lauréat.Command.ImporterActionnaireLauréat',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    actionnaire: String;
    importéLe: DateTime.ValueType;
  }
>;

// TODO: ajouter un check sur l'existence de demande de changement d'actionnaire quand ça sera implémenté

export const registerImporterActionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadLauréat = Lauréat.loadLauréatFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);

  const handler: MessageHandler<ImporterActionnaireLauréatCommand> = async ({
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

  mediator.register('Lauréat.Command.ImporterActionnaireLauréat', handler);
};
