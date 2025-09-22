'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
  dateSignature: zod.string().min(1),
  propositionTechniqueEtFinanciereSignee: singleDocument({
    acceptedFileTypes: ['application/pdf'],
  }),
});

export type TransmettrePropositionTechniqueEtFinancièreFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, referenceDossier, dateSignature, propositionTechniqueEtFinanciereSignee },
) => {
  await mediator.send<Lauréat.Raccordement.RaccordementUseCase>({
    type: 'Lauréat.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
    data: {
      identifiantProjetValue: identifiantProjet,
      référenceDossierRaccordementValue: referenceDossier,
      dateSignatureValue: new Date(dateSignature).toISOString(),
      propositionTechniqueEtFinancièreSignéeValue: propositionTechniqueEtFinanciereSignee,
    },
  });

  return {
    status: 'success',
    redirection: { url: Routes.Raccordement.détail(identifiantProjet) },
  };
};

export const transmettrePropositionTechniqueEtFinancièreAction = formAction(action, schema);
