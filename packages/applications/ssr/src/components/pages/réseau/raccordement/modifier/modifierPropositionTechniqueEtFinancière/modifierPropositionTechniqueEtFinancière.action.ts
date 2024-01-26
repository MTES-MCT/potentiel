'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type ModifierPropositionTechniqueEtFinancièreState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  référenceDossierRaccordement: zod.string(),
  dateSignature: zod.string(),
  propositionTechniqueEtFinancièreSignée: zod.instanceof(Blob),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  {
    identifiantProjet,
    référenceDossierRaccordement,
    propositionTechniqueEtFinancièreSignée,
    dateSignature,
  },
) => {
  await mediator.send<Raccordement.RaccordementUseCase>({
    type: 'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      référenceDossierRaccordementValue: référenceDossierRaccordement,
      dateSignatureValue: dateSignature,
      propositionTechniqueEtFinancièreSignéeValue: {
        content: propositionTechniqueEtFinancièreSignée.stream(),
        format: propositionTechniqueEtFinancièreSignée.type,
      },
    },
  });

  return previousState;
};

export const modifierPropositionTechniqueEtFinancièreAction = formAction(action, schema);
