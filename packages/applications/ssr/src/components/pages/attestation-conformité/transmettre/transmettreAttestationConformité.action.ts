'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Achèvement } from '@potentiel-domain/laureat';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type TransmettreAttestationConformitéState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  attestation: zod.instanceof(Blob).refine((data) => data.size > 0),
  preuveTransmissionAuCocontractant: zod.instanceof(Blob).refine((data) => data.size > 0),
  dateTransmissionAuCocontractant: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, props) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Achèvement.TransmettreAttestationConformitéUseCase>({
      type: 'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
      data: {
        identifiantProjetValue: props.identifiantProjet,
        attestationValue: {
          content: props.attestation.stream(),
          format: props.attestation.type,
        },
        preuveTransmissionAuCocontractantValue: {
          content: props.preuveTransmissionAuCocontractant.stream(),
          format: props.preuveTransmissionAuCocontractant.type,
        },
        dateTransmissionAuCocontractantValue: new Date(
          props.dateTransmissionAuCocontractant,
        ).toISOString(),
        dateValue: new Date().toISOString(),
        utilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
    };
  });

export const transmettreAttestationConformitéAction = formAction(action, schema);
