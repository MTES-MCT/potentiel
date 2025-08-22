import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';
import type { Fournisseur } from '../..';

export type EnregistrerChangementFournisseurCommand = Message<
  'Lauréat.Fournisseur.Command.EnregistrerChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateChangement: DateTime.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
    raison: string;
  } & (
    | {
        fournisseurs: Array<Fournisseur.ValueType>;
        évaluationCarboneSimplifiée: number;
      }
    | {
        fournisseurs: Array<Fournisseur.ValueType>;
        évaluationCarboneSimplifiée?: undefined;
      }
    | {
        fournisseurs?: undefined;
        évaluationCarboneSimplifiée: number;
      }
  )
>;

export const registerEnregistrerChangementFournisseurCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<EnregistrerChangementFournisseurCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);

    await projet.lauréat.fournisseur.enregistrerChangement({
      ...payload,
      ...(payload.fournisseurs
        ? {
            fournisseurs: payload.fournisseurs,
            évaluationCarboneSimplifiée: payload.évaluationCarboneSimplifiée,
          }
        : {
            évaluationCarboneSimplifiée: payload.évaluationCarboneSimplifiée,
            fournisseurs: undefined,
          }),
    });
  };
  mediator.register('Lauréat.Fournisseur.Command.EnregistrerChangement', handler);
};
