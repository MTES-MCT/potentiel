'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  réponseSignée: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
  choixPPAPourAutoritéCompétente: zod.stringbool().optional(),
  accorderMainlevéeGarantiesFinancières: zod.stringbool().optional(),
});

export type AccorderAbandonSansRecandidatureFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    réponseSignée,
    choixPPAPourAutoritéCompétente,
    accorderMainlevéeGarantiesFinancières,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Abandon.AccorderAbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.AccorderAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        rôleUtilisateurValue: utilisateur.rôle.nom,
        dateAccordValue: new Date().toISOString(),
        réponseSignéeValue: réponseSignée,
        ...(accorderMainlevéeGarantiesFinancières === true && {
          accorderMainlevéeGarantiesFinancièresValue: true,
        }),
        ...(choixPPAPourAutoritéCompétente && { ppaSignaléValue: true }),
        ...(choixPPAPourAutoritéCompétente === false && { ppaAnnuléValue: true }),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Abandon.détailRedirection(identifiantProjet),
      },
    };
  });

export const accorderAbandonSansRecandidatureAction = formAction(action, schema);
