import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadPuissanceFactory } from '../puissance.aggregate';
import { Lauréat } from '../..';

export type ImporterPuissanceCommand = Message<
  'Lauréat.Puissance.Command.ImporterPuissance',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    importéeLe: DateTime.ValueType;
  }
>;

export const registerImporterPuissanceCommand = (loadAggregate: LoadAggregate) => {
  const loadPuissance = loadPuissanceFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);
  const loadLauréat = Lauréat.loadLauréatFactory(loadAggregate);

  const handler: MessageHandler<ImporterPuissanceCommand> = async ({
    identifiantProjet,
    importéeLe,
  }) => {
    await loadLauréat(identifiantProjet);

    const { puissance } = await loadCandidature(identifiantProjet);

    const puissance = await loadPuissance(identifiantProjet, false);

    await puissance.importer({
      identifiantProjet,
      puissance,
      importéeLe,
    });
  };

  mediator.register('Lauréat.Puissance.Command.ImporterPuissance', handler);
};
