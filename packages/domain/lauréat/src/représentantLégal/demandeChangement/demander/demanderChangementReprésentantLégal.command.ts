import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadReprésentantLégalFactory } from '../../représentantLégal.aggregate';
import { TypeReprésentantLégal } from '../..';

export type DemanderChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.DemanderChangementReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.ValueType;
    piècesJustificatives: Array<DocumentProjet.ValueType>;
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
    nomReprésentantLégal,
    typeReprésentantLégal,
    piècesJustificatives,
    identifiantUtilisateur,
    dateDemande,
  }) => {
    const représentantLégal = await loadReprésentantLégal(identifiantProjet, false);

    await représentantLégal.demander({
      identifiantProjet,
      identifiantUtilisateur,
      nomReprésentantLégal,
      typeReprésentantLégal,
      dateDemande,
      piècesJustificatives,
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.DemanderChangementReprésentantLégal',
    handler,
  );
};
