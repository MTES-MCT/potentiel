import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { Role } from '@potentiel-domain/utilisateur';

import { loadActionnaireFactory } from '../actionnaire.aggregate';
import { loadAbandonFactory } from '../../abandon';
import { loadAchèvementFactory } from '../../achèvement/achèvement.aggregate';
import {
  ProjetAbandonnéError,
  ProjetAvecDemandeAbandonEnCoursError,
  ProjetAchevéError,
} from '../errors';

export type ModifierActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.ModifierActionnaire',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    actionnaire: string;
    dateModification: DateTime.ValueType;
    pièceJustificative?: DocumentProjet.ValueType;
    rôle: Role.ValueType;
  }
>;

export const registerModifierActionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);
  const handler: MessageHandler<ModifierActionnaireCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    actionnaire,
    dateModification,
    pièceJustificative,
    rôle,
  }) => {
    const actionnaireAggrégat = await loadActionnaire(identifiantProjet);
    const abandon = await loadAbandon(identifiantProjet, false);
    const achèvement = await loadAchèvement(identifiantProjet, false);
    const utilisateurEstPorteur = rôle.estÉgaleÀ(Role.porteur);

    /**
     * @todo
     * Ces checks devraient être fait au niveau du behavior
     */
    if (abandon.statut.estAccordé() && utilisateurEstPorteur) {
      throw new ProjetAbandonnéError();
    }

    if (abandon.statut.estEnCours() && utilisateurEstPorteur) {
      throw new ProjetAvecDemandeAbandonEnCoursError();
    }

    if (achèvement.estAchevé() && utilisateurEstPorteur) {
      throw new ProjetAchevéError();
    }
    /****/

    await actionnaireAggrégat.modifier({
      identifiantProjet,
      identifiantUtilisateur,
      actionnaire,
      dateModification,
      pièceJustificative,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.ModifierActionnaire', handler);
};
