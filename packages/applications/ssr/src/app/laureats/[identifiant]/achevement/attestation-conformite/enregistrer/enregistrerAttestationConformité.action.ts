'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  attestation: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
  rapportAssocie: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type EnregistrerAttestationConformitéFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, attestation, rapportAssocie },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Achèvement.EnregistrerAttestationConformitéUseCase>({
      type: 'Lauréat.Achèvement.UseCase.EnregistrerAttestationConformité',
      data: {
        identifiantProjetValue: identifiantProjet,
        attestationConformitéValue: attestation,
        rapportAssociéValue: rapportAssocie,
        enregistréeLeValue: new Date().toISOString(),
        enregistréeParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.GarantiesFinancières.détail(identifiantProjet),
        message: 'Votre attestation de conformité avec son rapport associé a bien été enregistrée',
      },
    };
  });

export const enregistrerAttestationConformitéAction = formAction(action, schema);
