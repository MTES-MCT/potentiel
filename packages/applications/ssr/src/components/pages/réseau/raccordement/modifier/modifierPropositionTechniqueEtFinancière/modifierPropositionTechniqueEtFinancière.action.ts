'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type ModifierPropositionTechniqueEtFinancièreState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  referenceDossierRaccordement: zod.string(),
  dateSignature: zod.string(),
  propositionTechniqueEtFinanciereSignee: zod.instanceof(Blob),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  {
    identifiantProjet,
    referenceDossierRaccordement,
    propositionTechniqueEtFinanciereSignee,
    dateSignature,
  },
) => {
  await mediator.send<Raccordement.RaccordementUseCase>({
    type: 'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      référenceDossierRaccordementValue: referenceDossierRaccordement,
      dateSignatureValue: new Date(dateSignature).toISOString(),
      propositionTechniqueEtFinancièreSignéeValue: {
        content: propositionTechniqueEtFinanciereSignee.stream(),
        format: propositionTechniqueEtFinanciereSignee.type,
      },
    },
  });

  return {
    status: 'success',
  };
};

export const modifierPropositionTechniqueEtFinancièreAction = formAction(action, schema);
