'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { keepOrUpdateSingleDocument } from '@/utils/zod/document/keepOrUpdateDocument';

const commonSchema = {
  identifiantProjet: zod.string().min(1),
  dateConstitution: zod.string().min(1, { message: 'Champ obligatoire' }),
  attestation: keepOrUpdateSingleDocument({ acceptedFileTypes: ['application/pdf'] }),
};

const schema = zod.discriminatedUnion('type', [
  zod.object({
    ...commonSchema,
    type: zod.literal('avec-date-échéance'),
    dateEcheance: zod.string().min(1, { message: 'Champ obligatoire' }),
  }),
  zod.object({
    ...commonSchema,
    type: zod.enum(['six-mois-après-achèvement', 'consignation']),
  }),
]);

export type ModifierDépôtGarantiesFinancièresFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, data) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.GarantiesFinancières.ModifierDépôtGarantiesFinancièresEnCoursUseCase>(
      {
        type: 'Lauréat.GarantiesFinancières.UseCase.ModifierDépôtGarantiesFinancièresEnCours',
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
      },
    );

    return {
      status: 'success',
      redirection: { url: Routes.GarantiesFinancières.détail(data.identifiantProjet) },
    };
  });

export const modifierDépôtGarantiesFinancièresAction = formAction(action, schema);
