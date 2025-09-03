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
  reponseSignee: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type RejeterDemandeDélaiFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, reponseSignee, dateDemande },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Délai.RejeterDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.RejeterDemandeDélai',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateRejetValue: new Date().toISOString(),
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
        message: `La demande de délai a bien été rejetée`,
      },
    };
  });

export const rejeterDemandeDélaiAction = formAction(action, schema);
