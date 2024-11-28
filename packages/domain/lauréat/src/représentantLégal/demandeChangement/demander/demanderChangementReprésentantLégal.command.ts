import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadReprésentantLégalFactory } from '../../représentantLégal.aggregate';
import { TypeReprésentantLégal } from '../..';

export type DemanderChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.DemanderChangementReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderChangementReprésentantLégalCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadReprésentantLégal = loadReprésentantLégalFactory(loadAggregate);

  const handler: MessageHandler<DemanderChangementReprésentantLégalCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    nomReprésentantLégal,
    typeReprésentantLégal,
    dateDemande,
  }) => {
    const représentantLégal = await loadReprésentantLégal(identifiantProjet, false);

    await représentantLégal.demander({
      identifiantProjet,
      identifiantUtilisateur,
      nomReprésentantLégal,
      typeReprésentantLégal,
      dateDemande,
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.DemanderChangementReprésentantLégal',
    handler,
  );
};
