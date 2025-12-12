'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { getContext } from '@potentiel-applications/request-context';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  nombreDeMois: zod.coerce.number().min(1),
  reponseSignee: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type AccorderDemandeDélaiFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, nombreDeMois, reponseSignee },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Délai.AccorderDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.AccorderDemandeDélai',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateAccordValue: new Date().toISOString(),
        nombreDeMois,
        réponseSignéeValue: reponseSignee,
        rôleUtilisateurValue: utilisateur.rôle.nom,
      },
    });

    const { url } = getContext() ?? {};

    return {
      status: 'success',
      redirection: {
        url: url ?? Routes.Lauréat.détails(identifiantProjet),
        message: `La demande de délai a bien été accordée`,
      },
    };
  });

export const accorderDemandeDélaiAction = formAction(action, schema);
