'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateDemande: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, dateDemande },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Délai.PasserEnInstructionDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.PasserEnInstructionDemande',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        datePassageEnInstructionValue: new Date().toISOString(),
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
        message: 'La demande de délai été passée en instruction',
      },
    };
  });

export const passerEnInstructionDemandeDélaiAction = formAction(action, schema);
