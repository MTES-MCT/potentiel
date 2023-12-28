'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { Abandon } from '@potentiel-domain/laureat';
import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
//import { VérifierAccèsProjetQuery } from '@potentiel-domain/utilisateur';

export type DemanderAbandonState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  recandidature: zod.string().optional(),
  raison: zod.string().min(1),
  pieceJustificative: zod.instanceof(Blob),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, pieceJustificative, recandidature, raison },
) => {
  return withUtilisateur(async (utilisateur) => {
    // TODO : Rendre cette vérification automatiquement lors de l'exécution
    //        d'un(e) query/usecase avec un identifiantProjet
    // await mediator.send<VérifierAccèsProjetQuery>({
    //   type: 'VERIFIER_ACCES_PROJET_QUERY',
    //   data: {
    //     identifiantProjet,
    //     identifiantUtilisateur,
    //   },
    // });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'DEMANDER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue: new Date().toISOString(),
        raisonValue: raison,
        recandidatureValue: recandidature === 'true' ? true : false,
        ...(pieceJustificative.size > 0 && {
          pièceJustificativeValue: {
            content: pieceJustificative.stream(),
            format: pieceJustificative.type,
          },
        }),
      },
    });

    return previousState;
  });
};

export const demanderAbandonAction = formAction(action, schema);
