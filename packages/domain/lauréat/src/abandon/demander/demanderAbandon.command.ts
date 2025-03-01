import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadAbandonFactory } from '../abandon.aggregate';
import { loadAchèvementFactory } from '../../achèvement/achèvement.aggregate';

export type DemanderAbandonCommand = Message<
  'Lauréat.Abandon.Command.DemanderAbandon',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
    pièceJustificative: DocumentProjet.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderAbandonCommand = (loadAggregate: LoadAggregate) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);

  const handler: MessageHandler<DemanderAbandonCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    identifiantUtilisateur,
    dateDemande,
  }) => {
    const abandon = await loadAbandon(identifiantProjet, false);
    const achèvement = await loadAchèvement(identifiantProjet, false);

    await abandon.demander({
      identifiantProjet,
      pièceJustificative,
      raison,
      identifiantUtilisateur,
      dateDemande,
      estAchevé: achèvement.estAchevé(),
    });
  };
  mediator.register('Lauréat.Abandon.Command.DemanderAbandon', handler);
};
