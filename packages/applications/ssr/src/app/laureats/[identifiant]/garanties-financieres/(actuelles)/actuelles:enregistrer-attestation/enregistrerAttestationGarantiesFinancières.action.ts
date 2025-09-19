'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateConstitution: zod.string(),
  attestation: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type EnregistrerAttestationGarantiesFinancièresFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, dateConstitution, attestation },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.GarantiesFinancières.EnregistrerAttestationGarantiesFinancièresUseCase>(
      {
        type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerAttestation',
        data: {
          identifiantProjetValue: identifiantProjet,
          dateConstitutionValue: new Date(dateConstitution).toISOString(),
          attestationValue: attestation,
          enregistréLeValue: new Date().toISOString(),
          enregistréParValue: utilisateur.identifiantUtilisateur.formatter(),
        },
      },
    );

    return {
      status: 'success',
      redirection: { url: Routes.GarantiesFinancières.détail(identifiantProjet) },
    };
  });

export const enregistrerAttestationGarantiesFinancièresAction = formAction(action, schema);
