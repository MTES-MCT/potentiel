'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { document } from '@/utils/zod/documentTypes';

export type enregistrerAttestationGarantiesFinancièresState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateConstitution: zod
    .string()
    .min(1, { message: 'Date de constitution des garanties financières obligatoire' }),
  attestation: document,
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, dateConstitution, attestation },
) =>
  withUtilisateur(async (utilisateur) => {
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
      redirectUrl: Routes.GarantiesFinancières.détail(identifiantProjet),
    };
  });

export const enregistrerAttestationGarantiesFinancièresAction = formAction(action, schema);
