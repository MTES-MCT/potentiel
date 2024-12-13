'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { keepOrUpdateSingleDocument } from '@/utils/zod/document/keepOrUpdateDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossierRaccordement: zod.string().min(1),
  dateSignature: zod.string().min(1, { message: 'Champ obligatoire' }),
  propositionTechniqueEtFinanciereSignee: keepOrUpdateSingleDocument({
    acceptedFileTypes: ['application/pdf'],
  }),
});

export type ModifierPropositionTechniqueEtFinancièreFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    referenceDossierRaccordement,
    propositionTechniqueEtFinanciereSignee,
    dateSignature,
  },
) => {
  await mediator.send<Raccordement.RaccordementUseCase>({
    type: 'Réseau.Raccordement.UseCase.ModifierPropositionTechniqueEtFinancière',
    data: {
      identifiantProjetValue: identifiantProjet,
      référenceDossierRaccordementValue: referenceDossierRaccordement,
      dateSignatureValue: new Date(dateSignature).toISOString(),
      propositionTechniqueEtFinancièreSignéeValue: propositionTechniqueEtFinanciereSignee,
    },
  });

  return {
    status: 'success',
    redirect: { url: Routes.Raccordement.détail(identifiantProjet) },
  };
};

export const modifierPropositionTechniqueEtFinancièreAction = formAction(action, schema);
