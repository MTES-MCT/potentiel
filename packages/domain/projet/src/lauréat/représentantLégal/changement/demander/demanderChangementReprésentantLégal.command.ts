import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';
import type { TypeReprésentantLégal } from '../..';

export type DemanderChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.DemanderChangementReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderChangementReprésentantLégalCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<DemanderChangementReprésentantLégalCommand> = async ({
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    identifiantUtilisateur,
    dateDemande,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.représentantLégal.demanderChangement({
      nomReprésentantLégal,
      typeReprésentantLégal,
      pièceJustificative,
      identifiantUtilisateur,
      dateDemande,
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.DemanderChangementReprésentantLégal',
    handler,
  );
};
