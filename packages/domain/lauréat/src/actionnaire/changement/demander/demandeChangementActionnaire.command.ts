import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadActionnaireFactory } from '../../actionnaire.aggregate';
import { loadAbandonFactory } from '../../../abandon';
import { loadAchèvementFactory } from '../../../achèvement/achèvement.aggregate';
import {
  ProjetAbandonnéError,
  ProjetAvecDemandeAbandonEnCoursError,
  ProjetAchevéError,
} from '../../errors';

export type DemanderChangementCommand = Message<
  'Lauréat.Actionnaire.Command.DemanderChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
    actionnaire: string;
    pièceJustificative: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderChangementActionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);
  const handler: MessageHandler<DemanderChangementCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    actionnaire,
    identifiantUtilisateur,
    dateDemande,
  }) => {
    const actionnaireAggrégat = await loadActionnaire(identifiantProjet);
    const abandon = await loadAbandon(identifiantProjet, false);
    const achèvement = await loadAchèvement(identifiantProjet, false);

    /**
     * @todo
     * Ces checks devraient être fait au niveau du behavior
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

    await actionnaireAggrégat.demanderChangement({
      identifiantProjet,
      pièceJustificative,
      raison,
      identifiantUtilisateur,
      dateDemande,
      actionnaire,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.DemanderChangement', handler);
};
