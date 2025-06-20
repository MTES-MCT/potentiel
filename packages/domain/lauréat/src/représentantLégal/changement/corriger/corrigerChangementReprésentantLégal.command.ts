import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { loadReprésentantLégalFactory } from '../../représentantLégal.aggregate';

export type CorrigerChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.CorrigerChangementReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateCorrection: DateTime.ValueType;
  }
>;

export const registerCorrigerChangementReprésentantLégalCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadReprésentantLégal = loadReprésentantLégalFactory(loadAggregate);

  const handler: MessageHandler<CorrigerChangementReprésentantLégalCommand> = async ({
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    identifiantUtilisateur,
    dateCorrection,
  }) => {
    const représentantLégal = await loadReprésentantLégal(identifiantProjet, false);

    await représentantLégal.corriger({
      identifiantProjet,
      identifiantUtilisateur,
      nomReprésentantLégal,
      typeReprésentantLégal,
      dateCorrection,
      pièceJustificative,
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.CorrigerChangementReprésentantLégal',
    handler,
  );
};
