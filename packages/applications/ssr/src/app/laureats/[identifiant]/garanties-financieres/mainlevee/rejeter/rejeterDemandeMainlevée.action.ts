'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  reponseSignee: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type RejeterDemandeMainlevéeGarantiesFinancièresFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, reponseSignee },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.GarantiesFinancières.RejeterMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.RejeterMainlevée',
      data: {
        identifiantProjetValue: identifiantProjet,
        rejetéLeValue: new Date().toISOString(),
        rejetéParValue: utilisateur.identifiantUtilisateur.formatter(),
        réponseSignéeValue: reponseSignee,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.GarantiesFinancières.détail(identifiantProjet),
      },
    };
  });
};

export const rejeterDemandeMainlevéeAction = formAction(action, schema);
