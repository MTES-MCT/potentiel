import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type DemanderChangementCommand = Message<
  'Lauréat.Puissance.Command.DemanderChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
    puissance: number;
    puissanceDeSite?: number;
    pièceJustificative: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderChangementPuissanceCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<DemanderChangementCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    puissance,
    puissanceDeSite,
    identifiantUtilisateur,
    dateDemande,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.puissance.demanderChangement({
      puissance,
      puissanceDeSite,
      pièceJustificative,
      raison,
      identifiantUtilisateur,
      dateDemande,
    });
  };
  mediator.register('Lauréat.Puissance.Command.DemanderChangement', handler);
};
