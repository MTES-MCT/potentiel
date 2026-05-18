import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type {
  DocumentProjet,
  GetProjetAggregateRoot,
  IdentifiantProjet,
} from '../../../../index.js';
import type { TypeReprésentantLégal } from '../../index.js';

export type CorrigerChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.CorrigerChangementReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.ValueType;
    pièceJustificative?: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateCorrection: DateTime.ValueType;
  }
>;

export const registerCorrigerChangementReprésentantLégalCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<CorrigerChangementReprésentantLégalCommand> = async ({
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    identifiantUtilisateur,
    dateCorrection,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    await projet.lauréat.représentantLégal.corrigerDemandeChangement({
      nomReprésentantLégal,
      typeReprésentantLégal,
      pièceJustificative,
      identifiantUtilisateur,
      dateCorrection,
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.CorrigerChangementReprésentantLégal',
    handler,
  );
};
