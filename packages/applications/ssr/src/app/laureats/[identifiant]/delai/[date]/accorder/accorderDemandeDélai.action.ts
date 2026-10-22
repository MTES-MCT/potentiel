'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  nombreDeMois: zod.coerce.number().min(1),
  motif: zod.enum(Lauréat.Délai.MotifDemandeDélai.motifs),
  reponseSignee: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type AccorderDemandeDélaiFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, nombreDeMois, motif, reponseSignee },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Délai.AccorderDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.AccorderDemandeDélai',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        motifValue: motif,
        dateAccordValue: new Date().toISOString(),
        nombreDeMois,
        réponseSignéeValue: reponseSignee,
        rôleUtilisateurValue: utilisateur.rôle.nom,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Délai.détailsPourRedirection(identifiantProjet),
        message: `La demande de délai a bien été accordée`,
      },
    };
  });

export const accorderDemandeDélaiAction = formAction(action, schema);
