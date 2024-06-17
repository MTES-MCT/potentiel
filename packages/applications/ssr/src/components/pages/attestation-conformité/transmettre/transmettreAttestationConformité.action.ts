'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Achèvement, GarantiesFinancières } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type TransmettreAttestationConformitéState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  attestation: zod.instanceof(Blob).refine((data) => data.size > 0),
  preuveTransmissionAuCocontractant: zod.instanceof(Blob).refine((data) => data.size > 0),
  dateTransmissionAuCocontractant: zod.string().min(1),
  demanderMainlevee: zod.string().optional(),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  {
    identifiantProjet,
    attestation,
    dateTransmissionAuCocontractant,
    preuveTransmissionAuCocontractant,
    demanderMainlevee,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Achèvement.TransmettreAttestationConformitéUseCase>({
      type: 'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
      data: {
        identifiantProjetValue: identifiantProjet,
        attestationValue: {
          content: attestation.stream(),
          format: attestation.type,
        },
        preuveTransmissionAuCocontractantValue: {
          content: preuveTransmissionAuCocontractant.stream(),
          format: preuveTransmissionAuCocontractant.type,
        },
        dateTransmissionAuCocontractantValue: new Date(
          dateTransmissionAuCocontractant,
        ).toISOString(),
        dateValue: new Date().toISOString(),
        utilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    if (demanderMainlevee === 'true') {
      await mediator.send<GarantiesFinancières.DemanderMainlevéeGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Demander',
        data: {
          identifiantProjetValue: identifiantProjet,
          motifValue: 'projet-achevé',
          demandéLeValue: DateTime.now().formatter(),
          demandéParValue: utilisateur.identifiantUtilisateur.formatter(),
        },
      });
    }

    return {
      status: 'success',
    };
  });

export const transmettreAttestationConformitéAction = formAction(action, schema);
