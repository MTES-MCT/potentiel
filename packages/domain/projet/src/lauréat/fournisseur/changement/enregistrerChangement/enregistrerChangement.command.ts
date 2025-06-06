import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';
import { TypeFournisseur } from '../..';

export type EnregistrerChangementFournisseurCommand = Message<
  'Lauréat.Fournisseur.Command.EnregistrerChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    fournisseurs?: Array<{
      typeFournisseur: TypeFournisseur.RawType;
      nomDuFabricant: string;
    }>;
    évaluationCarboneSimplifiée?: number;
    dateChangement: DateTime.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
    raison: string;
  }
>;

export const registerEnregistrerChangementFournisseurCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<EnregistrerChangementFournisseurCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.fournisseur.enregistrerChangement({
      ...payload,
      fournisseurs: payload.fournisseurs?.map((fournisseur) => ({
        ...fournisseur,
        typeFournisseur: TypeFournisseur.convertirEnValueType(fournisseur.typeFournisseur),
      })),
    });
  };
  mediator.register('Lauréat.Fournisseur.Command.EnregistrerChangement', handler);
};
