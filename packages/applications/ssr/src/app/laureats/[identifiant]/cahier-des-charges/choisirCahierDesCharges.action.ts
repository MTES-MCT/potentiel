'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  cahierDesCharges: zod.string().min(1),
});

export type ChoisirCahierDesChargesFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, body) => {
  return withUtilisateur(async (utilisateur) => {
    const { identifiantProjet: identifiantProjetValue, cahierDesCharges } = body;

    await mediator.send<Lauréat.ChoisirCahierDesChargesUseCase>({
      type: 'Lauréat.UseCase.ChoisirCahierDesCharges',
      data: {
        identifiantProjetValue,
        cahierDesChargesValue: cahierDesCharges,
        modifiéLeValue: DateTime.now().formatter(),
        modifiéParValue: utilisateur.identifiantUtilisateur.email,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Lauréat.détails.tableauDeBord(identifiantProjetValue),
        message: `Le cahier des charges du projet a été modifié`,
      },
    };
  });
};

export const choisirCahierDesChargesAction = formAction(action, schema);
