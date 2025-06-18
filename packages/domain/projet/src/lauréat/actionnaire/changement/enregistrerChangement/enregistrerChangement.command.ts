import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type EnregistrerChangementActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.EnregistrerChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    actionnaire: string;
    dateChangement: DateTime.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
    raison: string;
  }
>;

export const registerEnregistrerChangementActionnaireCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<EnregistrerChangementActionnaireCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    actionnaire,
    dateChangement,
    pièceJustificative,
    raison,
  }) => {
    // quickwin : nous passons ici par un appel à l'agrégat candidature au lieu de projet
    // Par ailleurs les données sont les mêmes à date (janv 2025)
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.actionnaire.enregistrerChangement({
      identifiantProjet,
      identifiantUtilisateur,
      actionnaire,
      dateChangement,
      pièceJustificative,
      raison,
      typeActionnariat: projet.candidature.typeActionnariat,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.EnregistrerChangement', handler);
};
