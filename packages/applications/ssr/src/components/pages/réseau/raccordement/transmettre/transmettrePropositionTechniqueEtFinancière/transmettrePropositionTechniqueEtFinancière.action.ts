'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type transmettrePropositionTechniqueEtFinancièreState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
  dateSignature: zod.string().min(1),
  propositionTechniqueEtFinanciereSignee: zod.instanceof(Blob).refine((data) => data.size > 0),
});

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

export const transmettrePropositionTechniqueEtFinancièreAction = formAction(action, schema);
