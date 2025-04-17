// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { loadReprésentantLégalFactory } from '../représentantLégal.aggregate';

export type ImporterReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.ImporterReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    importéLe: DateTime.ValueType;
    importéPar: Email.ValueType;
  }
>;

export const registerImporterReprésentantLégalCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadReprésentantLégal = loadReprésentantLégalFactory(loadAggregate);

  const handler: MessageHandler<ImporterReprésentantLégalCommand> = async ({
    identifiantProjet,
    importéLe,
    importéPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    projet.lauréat.vérifierQueLeLauréatExiste();

    const { nomReprésentantLégal } = projet.candidature;

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
