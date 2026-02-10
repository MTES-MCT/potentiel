import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import { TypeReprésentantLégal } from '../../index.js';

export type AccorderChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.AccorderChangementReprésentantLégal',
  {
    dateAccord: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  } & (
    | {
        nomReprésentantLégal: string;
        typeReprésentantLégal: TypeReprésentantLégal.ValueType;
        accordAutomatique: false;
      }
    | {
        accordAutomatique: true;
      }
  )
>;

export const registerAccorderChangementReprésentantLégalCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AccorderChangementReprésentantLégalCommand> = async (options) => {
    const projet = await getProjetAggregateRoot(options.identifiantProjet);
    await projet.lauréat.représentantLégal.accorderDemandeChangement(options);
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.AccorderChangementReprésentantLégal',
    handler,
  );
};
