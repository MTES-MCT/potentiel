import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot, IdentifiantProjet } from '@potentiel-domain/projet';

import { loadPuissanceFactory } from '../puissance.aggregate';

export type ImporterPuissanceCommand = Message<
  'Lauréat.Puissance.Command.ImporterPuissance',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    importéeLe: DateTime.ValueType;
  }
>;

export const registerImporterPuissanceCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadPuissance = loadPuissanceFactory(loadAggregate);

  const handler: MessageHandler<ImporterPuissanceCommand> = async ({
    identifiantProjet,
    importéeLe,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    projet.lauréat.vérifierQueLeLauréatExiste();

    const { puissanceProductionAnnuelle: puissanceFromCandidature } = projet.candidature;

    const puissance = await loadPuissance(identifiantProjet, false);

    await puissance.importer({
      identifiantProjet,
      puissance: puissanceFromCandidature,
      importéeLe,
    });
  };

  mediator.register('Lauréat.Puissance.Command.ImporterPuissance', handler);
};
