'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { manyDocuments } from '@/utils//zod/document/manyDocuments';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  attestation: manyDocuments({ acceptedFileTypes: ['application/pdf'] }),
});

export type EnregistrerAttestationConformitéFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, attestation },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Achèvement.EnregistrerAttestationConformitéUseCase>({
      type: 'Lauréat.Achèvement.UseCase.EnregistrerAttestationConformité',
      data: {
        identifiantProjetValue: identifiantProjet,
        attestationConformitéValue: attestation,
        enregistréeLeValue: new Date().toISOString(),
        enregistréeParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.GarantiesFinancières.détail(identifiantProjet),
        message: 'Votre attestation de conformité a bien été enregistrée',
      },
    };
  });

export const enregistrerAttestationConformitéAction = formAction(action, schema);
