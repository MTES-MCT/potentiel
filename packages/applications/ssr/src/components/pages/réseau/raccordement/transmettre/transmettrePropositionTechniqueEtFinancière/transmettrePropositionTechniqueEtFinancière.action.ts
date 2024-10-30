'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { singleDocument } from '@/utils/zod/document';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1, { message: 'Champ obligatoire' }),
  dateSignature: zod.string().min(1, { message: 'Champ obligatoire' }),
  propositionTechniqueEtFinanciereSignee: singleDocument(),
});

export type TransmettrePropositionTechniqueEtFinancièreFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, referenceDossier, dateSignature, propositionTechniqueEtFinanciereSignee },
) => {
  await mediator.send<Raccordement.RaccordementUseCase>({
    type: 'Réseau.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
    data: {
      identifiantProjetValue: identifiantProjet,
      référenceDossierRaccordementValue: referenceDossier,
      dateSignatureValue: new Date(dateSignature).toISOString(),
      propositionTechniqueEtFinancièreSignéeValue: propositionTechniqueEtFinanciereSignee,
    },
  });

  return {
    status: 'success',
    redirectUrl: Routes.Raccordement.détail(identifiantProjet),
  };
};

export const transmettrePropositionTechniqueEtFinancièreAction = formAction(action, schema);
