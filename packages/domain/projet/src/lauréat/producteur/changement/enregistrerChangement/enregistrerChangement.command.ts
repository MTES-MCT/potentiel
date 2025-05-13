import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type EnregistrerChangementProducteurCommand = Message<
  'Lauréat.Producteur.Command.EnregistrerChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    producteur: string;
    dateChangement: DateTime.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
    raison?: string;
  }
>;

export const registerChoisirCahierDesChargesCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<EnregistrerChangementProducteurCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.producteur.enregistrerChangement(payload);
  };
  mediator.register('Lauréat.Producteur.Command.EnregistrerChangement', handler);
};
