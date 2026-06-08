import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type {
  DocumentProjet,
  GetProjetAggregateRoot,
  IdentifiantProjet,
} from '../../../../index.js';
import type { NuméroIdentification } from '../../index.js';

export type CorrigerNuméroIdentificationCommand = Message<
  'Lauréat.Producteur.Command.CorrigerNuméroIdentification',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateChangement: DateTime.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
    numéroIdentification: NuméroIdentification.ValueType;
    raison?: string;
  }
>;

export const registerCorrigerNuméroIdentificationCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<CorrigerNuméroIdentificationCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.producteur.corrigerNuméroIdentification(payload);
  };
  mediator.register('Lauréat.Producteur.Command.CorrigerNuméroIdentification', handler);
};
