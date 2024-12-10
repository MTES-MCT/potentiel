'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Actionnaire } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  actionnaire: zod.string().min(1, { message: 'Champ obligatoire' }),
  pieceJustificative: singleDocument({ optional: true, acceptedFileTypes: ['application/pdf'] }),
});

export type TransmettreActionnaireFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, actionnaire, pieceJustificative },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Actionnaire.ActionnaireUseCase>({
      type: 'Lauréat.Actionnaire.UseCase.TransmettreActionnaire',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateTransmissionValue: new Date().toISOString(),
        actionnaireValue: actionnaire,
        ...(pieceJustificative && {
          pièceJustificativeValue: pieceJustificative,
        }),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
        message: "L'actionnaire a bien été transmis",
      },
    };
  });

export const transmettreActionnaireAction = formAction(action, schema);
