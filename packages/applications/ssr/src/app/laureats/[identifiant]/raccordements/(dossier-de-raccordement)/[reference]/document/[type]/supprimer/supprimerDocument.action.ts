'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  référenceDossierRaccordement: zod.string().min(1),
  type: zod.enum(Lauréat.Raccordement.TypeDocumentsRaccordement.type, {
    message: `Le type de document n'est pas valide`,
  }),
});

export type SupprimerDocumentFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, référenceDossierRaccordement, type },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Raccordement.SupprimerDocumentUseCase>({
      type: 'Lauréat.Raccordement.UseCase.SupprimerDocument',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierRaccordementValue: référenceDossierRaccordement,
        rôleValue: utilisateur.rôle.nom,
        typeValue: type,
        suppriméLeValue: DateTime.now().formatter(),
        suppriméParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Raccordement.détail(identifiantProjet) },
    };
  });

export const supprimerDocumentAction = formAction(action, schema);
