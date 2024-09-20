'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type enregistrerAttestationGarantiesFinancièresState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateConstitution: zod.string().min(1),
  attestation: zod.instanceof(Blob).refine((data) => data.size > 0),
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, dateConstitution, attestation },
) =>
  withUtilisateur(async (utilisateur) => {
    console.log('coucou', attestation.size);
    await mediator.send<GarantiesFinancières.GarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerAttestation',
      data: {
        identifiantProjetValue: identifiantProjet,
        dateConstitutionValue: new Date(dateConstitution).toISOString(),
        attestationValue: {
          content: attestation.stream(),
          format: attestation.type,
        },
        enregistréLeValue: new Date().toISOString(),
        enregistréParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
    };
  });

export const enregistrerAttestationGarantiesFinancièresAction = formAction(action, schema);
