import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadAbandonFactory } from '../../../abandon';
import { loadAchèvementFactory } from '../../../achèvement/achèvement.aggregate';
import { loadPuissanceFactory } from '../../puissance.aggregate';

export type EnregistrerChangementPuissanceCommand = Message<
  'Lauréat.Puissance.Command.EnregistrerChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    puissance: number;
    dateChangement: DateTime.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
    raison: string;
  }
>;

export const registerEnregistrerChangementPuissanceCommand = (loadAggregate: LoadAggregate) => {
  const loadPuissance = loadPuissanceFactory(loadAggregate);
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);

  const handler: MessageHandler<EnregistrerChangementPuissanceCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    puissance,
    dateChangement,
    pièceJustificative,
    raison,
  }) => {
    const puissanceAggrégat = await loadPuissance(identifiantProjet);
    const abandon = await loadAbandon(identifiantProjet, false);
    const achèvement = await loadAchèvement(identifiantProjet, false);

    await puissanceAggrégat.enregistrerChangement({
      identifiantProjet,
      identifiantUtilisateur,
      puissance,
      dateChangement,
      pièceJustificative,
      raison,
      estAbandonné: abandon.statut.estAccordé(),
      estAchevé: achèvement.estAchevé(),
      demandeAbandonEnCours: abandon.statut.estEnCours(),
    });
  };
  mediator.register('Lauréat.Puissance.Command.EnregistrerChangement', handler);
};
