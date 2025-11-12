import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type DemanderDélaiCommand = Message<
  'Lauréat.Délai.Command.DemanderDélai',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    nombreDeMois: number;
    raison: string;
    pièceJustificative: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderDélaiDélaiCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<DemanderDélaiCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    nombreDeMois,
    identifiantUtilisateur,
    dateDemande,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.délai.demanderDélai({
      pièceJustificative,
      raison,
      identifiantUtilisateur,
      dateDemande,
      nombreDeMois,
    });
  };
  mediator.register('Lauréat.Délai.Command.DemanderDélai', handler);
};
