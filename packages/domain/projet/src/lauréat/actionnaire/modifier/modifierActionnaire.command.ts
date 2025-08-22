import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type ModifierActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.ModifierActionnaire',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    actionnaire: string;
    dateModification: DateTime.ValueType;
    pièceJustificative?: DocumentProjet.ValueType;
    raison: string;
  }
>;

export const registerModifierActionnaireCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierActionnaireCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    actionnaire,
    dateModification,
    pièceJustificative,
    raison,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.actionnaire.modifier({
      identifiantUtilisateur,
      actionnaire,
      dateModification,
      pièceJustificative,
      raison,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.ModifierActionnaire', handler);
};
