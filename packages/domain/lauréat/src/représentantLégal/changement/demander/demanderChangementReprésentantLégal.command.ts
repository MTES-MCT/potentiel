import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadReprésentantLégalFactory } from '../../représentantLégal.aggregate';
import { TypeReprésentantLégal } from '../..';
import { loadAbandonFactory } from '../../../abandon';
import { loadAchèvementFactory } from '../../../achèvement/achèvement.aggregate';

import {
  ProjetAbandonnéError,
  ProjetAchevéError,
  ProjetAvecDemandeAbandonEnCoursError,
} from './demanderChangementReprésentantLégal.errors';

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
  loadAggregate: LoadAggregate,
) => {
  const loadReprésentantLégal = loadReprésentantLégalFactory(loadAggregate);
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);

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
    const achèvement = await loadAchèvement(identifiantProjet, false);

    /**
     * @todo
     * Ces checks devraient être fait au niveau du behavior lorsque le système d'aggregate root sera en place
     */
    if (abandon.statut.estAccordé()) {
      throw new ProjetAbandonnéError();
    }

    if (abandon.statut.estEnCours()) {
      throw new ProjetAvecDemandeAbandonEnCoursError();
    }

    if (achèvement.estAchevé()) {
      throw new ProjetAchevéError();
    }
    /****/

    await représentantLégal.demander({
      identifiantProjet,
      identifiantUtilisateur,
      nomReprésentantLégal,
      typeReprésentantLégal,
      dateDemande,
      pièceJustificative,
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.DemanderChangementReprésentantLégal',
    handler,
  );
};
