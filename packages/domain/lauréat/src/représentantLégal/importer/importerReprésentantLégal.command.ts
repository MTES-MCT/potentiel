// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadReprésentantLégalFactory } from '../représentantLégal.aggregate';
import { Lauréat } from '../..';

export type ImporterReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.ImporterReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    importéLe: DateTime.ValueType;
    importéPar: Email.ValueType;
  }
>;

export const registerImporterReprésentantLégalCommand = (loadAggregate: LoadAggregate) => {
  const loadReprésentantLégal = loadReprésentantLégalFactory(loadAggregate);
  const loadLauréat = Lauréat.loadLauréatFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);
  const handler: MessageHandler<ImporterReprésentantLégalCommand> = async ({
    identifiantProjet,
    importéLe,
    importéPar,
  }) => {
    await loadLauréat(identifiantProjet);

    const { nomReprésentantLégal } = await loadCandidature(identifiantProjet);

    const représentantLégal = await loadReprésentantLégal(identifiantProjet, false);

    await représentantLégal.importer({
      identifiantProjet,
      nomReprésentantLégal,
      importéLe,
      importéPar,
    });
  };
  mediator.register('Lauréat.ReprésentantLégal.Command.ImporterReprésentantLégal', handler);
};
