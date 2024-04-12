'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type ModifierGarantiesFinancièresState = FormState;

const commonSchema = {
  identifiantProjet: zod.string().min(1),
  dateConstitution: zod.string().min(1),
  attestation: zod.instanceof(Blob).refine((data) => data.size > 0),
};

const schema = zod.discriminatedUnion('type', [
  zod.object({
    ...commonSchema,
    type: zod.literal('avec-date-échéance'),
    dateEcheance: zod.string().min(1),
  }),
  zod.object({
    ...commonSchema,
    type: zod.enum(['six-mois-après-achèvement', 'consignation']),
  }),
]);

const action: FormAction<FormState, typeof schema> = async (_, props) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<GarantiesFinancières.GarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ModifierDépôtGarantiesFinancièresEnCours',
      data: {
        identifiantProjetValue: props.identifiantProjet,
        typeValue: props.type,
        dateÉchéanceValue:
          props.type === 'avec-date-échéance'
            ? new Date(props.dateEcheance).toISOString()
            : undefined,
        dateConstitutionValue: new Date(props.dateConstitution).toISOString(),
        attestationValue: {
          content: props.attestation.stream(),
          format: props.attestation.type,
        },
        modifiéLeValue: new Date().toISOString(),
        modifiéParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
    };
  });

export const modifierDépôtEnCoursGarantiesFinancièresAction = formAction(action, schema);
