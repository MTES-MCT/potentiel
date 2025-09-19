'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateDemande: zod.string().min(1),
  nombreDeMois: zod.coerce.number().min(1),
  reponseSignee: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type AccorderDemandeDélaiFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, nombreDeMois, reponseSignee, dateDemande },
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
        rôleUtilisateurValue: utilisateur.role.nom,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Délai.détail(
          identifiantProjet,
          DateTime.convertirEnValueType(dateDemande).formatter(),
        ),
        message: `La demande de délai a bien été accordée`,
      },
    };
  });

export const accorderDemandeDélaiAction = formAction(action, schema);
