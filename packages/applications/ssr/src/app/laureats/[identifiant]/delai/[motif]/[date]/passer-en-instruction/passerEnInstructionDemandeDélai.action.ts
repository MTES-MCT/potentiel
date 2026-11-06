'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  motif: zod.enum(Lauréat.Délai.MotifDemandeDélai.motifs),
});

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet, motif }) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Délai.PasserEnInstructionDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.PasserEnInstructionDemande',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        datePassageEnInstructionValue: new Date().toISOString(),
        rôleUtilisateurValue: utilisateur.rôle.nom,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Délai.détailsPourRedirection(identifiantProjet, motif),
        message: 'La demande de délai a bien été passée en instruction',
      },
    };
  });

export const passerEnInstructionDemandeDélaiAction = formAction(action, schema);
