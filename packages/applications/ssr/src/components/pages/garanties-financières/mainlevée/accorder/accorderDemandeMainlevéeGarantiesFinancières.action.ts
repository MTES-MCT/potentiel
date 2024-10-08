'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { document } from '@/utils/zod/documentTypes';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  reponseSignee: document,
});

export type AccorderDemandeMainlevéeGarantiesFinancièresFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, reponseSignee },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<GarantiesFinancières.AccorderDemandeMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.AccorderDemandeMainlevée',
      data: {
        identifiantProjetValue: identifiantProjet,
        accordéLeValue: new Date().toISOString(),
        accordéParValue: utilisateur.identifiantUtilisateur.formatter(),
        réponseSignéeValue: {
          content: reponseSignee.stream(),
          format: reponseSignee.type,
        },
      },
    });

    return {
      status: 'success',
      redirectUrl: Routes.GarantiesFinancières.détail(identifiantProjet),
    };
  });
};

export const accorderDemandeMainlevéeGarantiesFinancièresAction = formAction(action, schema);
