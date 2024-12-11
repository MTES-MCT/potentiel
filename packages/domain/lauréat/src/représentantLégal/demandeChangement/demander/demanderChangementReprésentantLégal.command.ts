import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadReprésentantLégalFactory } from '../../représentantLégal.aggregate';
import { TypeReprésentantLégal } from '../..';
import { loadAbandonFactory } from '../../../abandon';

export type DemanderChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.DemanderChangementReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.ValueType;
    pièceJustificative?: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderChangementReprésentantLégalCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadReprésentantLégal = loadReprésentantLégalFactory(loadAggregate);
  const loadAbandon = loadAbandonFactory(loadAggregate);

  const handler: MessageHandler<DemanderChangementReprésentantLégalCommand> = async ({
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    identifiantUtilisateur,
    dateDemande,
  }) => {
    const représentantLégal = await loadReprésentantLégal(identifiantProjet, false);
    const abandon = await loadAbandon(identifiantProjet, false);

    await représentantLégal.demander({
      identifiantProjet,
      identifiantUtilisateur,
      nomReprésentantLégal,
      typeReprésentantLégal,
      dateDemande,
      pièceJustificative,
      projetAbandonné: abandon.statut.estAccordé(),
      projetAvecDemandeAbandonEnCours: abandon.statut.estEnCours(),
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.DemanderChangementReprésentantLégal',
    handler,
  );
};
