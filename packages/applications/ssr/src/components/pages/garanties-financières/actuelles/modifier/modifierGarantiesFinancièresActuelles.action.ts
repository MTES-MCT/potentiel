'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { keepOrUpdateDocument } from '@/utils/zod/documentTypes';

const commonSchema = {
  identifiantProjet: zod.string().min(1),
  dateConstitution: zod
    .string()
    .min(1, { message: 'Date de constitution des garanties financières obligatoire' }),
  attestation: keepOrUpdateDocument,
};

const schema = zod.discriminatedUnion('type', [
  zod.object({
    ...commonSchema,
    type: zod.literal('avec-date-échéance'),
    dateEcheance: zod.string().min(1, { message: "date d'échéance obligatoire" }),
  }),
  zod.object({
    ...commonSchema,
    type: zod.enum(['six-mois-après-achèvement', 'consignation']),
  }),
]);

export type ModifierGarantiesFinancièresFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, data) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<GarantiesFinancières.GarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ModifierGarantiesFinancières',
      data: {
        identifiantProjetValue: data.identifiantProjet,
        typeValue: data.type,
        dateÉchéanceValue:
          data.type === 'avec-date-échéance'
            ? new Date(data.dateEcheance).toISOString()
            : undefined,
        dateConstitutionValue: new Date(data.dateConstitution).toISOString(),
        attestationValue: data.attestation,
        modifiéLeValue: new Date().toISOString(),
        modifiéParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirectUrl: Routes.GarantiesFinancières.détail(data.identifiantProjet),
    };
  });

export const modifierGarantiesFinancièresActuellesAction = formAction(action, schema);
