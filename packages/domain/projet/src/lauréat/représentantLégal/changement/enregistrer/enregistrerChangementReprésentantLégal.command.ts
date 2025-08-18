import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { TypeReprésentantLégal } from '../..';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type EnregistrerChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.EnregistrerChangementReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateChangement: DateTime.ValueType;
  }
>;

export const registerEnregistrerChangementReprésentantLégalCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<EnregistrerChangementReprésentantLégalCommand> = async ({
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    identifiantUtilisateur,
    dateChangement,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.représentantLégal.enregistrerChangement({
      nomReprésentantLégal,
      typeReprésentantLégal,
      pièceJustificative,
      identifiantUtilisateur,
      dateChangement,
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.EnregistrerChangementReprésentantLégal',
    handler,
  );
};
