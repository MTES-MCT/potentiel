import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../../..';
import { Fournisseur } from '../../..';
import { ChangementFournisseurChampsManquantsError } from '../../../fournisseur.error';
import { ModifierFournisseurOptions } from '../modifierFournisseur.option';

export type MettreÀJourFournisseurCommand = Message<
  'Lauréat.Fournisseur.Command.MettreÀJour',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    rôleUtilisateur: Role.ValueType;
    date: DateTime.ValueType;
    pièceJustificative?: DocumentProjet.ValueType;
    raison?: string;
  } & (
    | {
        fournisseurs?: Array<Fournisseur.ValueType>;
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

export const registerMettreÀJourFournisseurCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<MettreÀJourFournisseurCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);

    const mettreÀJourPayload: ModifierFournisseurOptions = {
      ...payload,
      dateModification: payload.date,
      ...(payload.fournisseurs
        ? {
            fournisseurs: payload.fournisseurs,
            évaluationCarboneSimplifiée: payload.évaluationCarboneSimplifiée,
          }
        : {
            évaluationCarboneSimplifiée: payload.évaluationCarboneSimplifiée,
            fournisseurs: undefined,
          }),
    };

    if (payload.rôleUtilisateur.aLaPermission('fournisseur.modifier')) {
      await projet.lauréat.fournisseur.modifier(mettreÀJourPayload);
    } else {
      await projet.lauréat.fournisseur.enregistrerChangement(
        mapToEnregistrerChangementPayload(mettreÀJourPayload),
      );
    }
  };
  mediator.register('Lauréat.Fournisseur.Command.MettreÀJour', handler);
};

const mapToEnregistrerChangementPayload = (payload: ModifierFournisseurOptions) => {
  if (!payload.pièceJustificative || !payload.raison) {
    throw new ChangementFournisseurChampsManquantsError();
  }

  return {
    ...payload,
    pièceJustificative: payload.pièceJustificative,
    raison: payload.raison,
    dateChangement: payload.dateModification,
  };
};
