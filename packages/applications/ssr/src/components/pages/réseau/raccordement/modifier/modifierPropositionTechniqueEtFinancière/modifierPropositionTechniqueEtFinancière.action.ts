'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type ModifierPropositionTechniqueEtFinancièreState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossierRaccordement: zod.string().min(1),
  dateSignature: zod.string().min(1),
  propositionTechniqueEtFinanciereSignee: zod.instanceof(Blob).refine((data) => data.size > 0),
});

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
