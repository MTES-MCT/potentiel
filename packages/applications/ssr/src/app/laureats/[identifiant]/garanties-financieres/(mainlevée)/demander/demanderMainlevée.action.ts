'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { manyDocuments } from '@/utils/zod/document/manyDocuments';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  motif: zod.enum(['projet-abandonné', 'projet-achevé']),

  // Pas nécessaire en cas d'abandon, dans l'autre cas, l'erreur est gérée dans le front et dans le domaine
  attestationConformite: manyDocuments({
    acceptedFileTypes: ['application/pdf'],
    optional: true,
  }).optional(),
});

export type DemanderMainlevéeFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, motif, attestationConformite },
) =>
  withUtilisateur(async (utilisateur) => {
    if (attestationConformite) {
      await mediator.send<Lauréat.Achèvement.EnregistrerAttestationConformitéUseCase>({
        type: 'Lauréat.Achèvement.UseCase.EnregistrerAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet,
          attestationConformitéValue: attestationConformite,
          enregistréeParValue: utilisateur.identifiantUtilisateur.formatter(),
          enregistréeLeValue: new Date().toISOString(),
        },
      });

      await new Promise((r) => setTimeout(r, 1500));
    }

    await mediator.send<Lauréat.GarantiesFinancières.DemanderMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.DemanderMainlevée',
      data: {
        identifiantProjetValue: identifiantProjet,
        demandéLeValue: new Date().toISOString(),
        demandéParValue: utilisateur.identifiantUtilisateur.formatter(),
        motifValue: motif,
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.GarantiesFinancières.détail(identifiantProjet) },
    };
  });

export const demanderMainlevéeAction = formAction(action, schema);
