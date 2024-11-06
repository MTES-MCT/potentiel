// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

// Package
import { loadReprésentantLégalFactory } from '../représentantLégal.aggregate';
import { loadLauréatFactory } from '../../lauréat.aggregate';

export type ImporterReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.ImporterReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    nomReprésentantLégal: string;
    importéLe: DateTime.ValueType;
    importéPar: Email.ValueType;
  }
>;

export const registerImporterReprésentantLégalCommand = (loadAggregate: LoadAggregate) => {
  const loadReprésentantLégal = loadReprésentantLégalFactory(loadAggregate);
  const loadLauréat = loadLauréatFactory(loadAggregate);
  const handler: MessageHandler<ImporterReprésentantLégalCommand> = async ({
    identifiantProjet,
    nomReprésentantLégal,
    importéLe,
    importéPar,
  }) => {
    await loadLauréat(identifiantProjet);

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
