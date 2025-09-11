'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { keepOrUpdateSingleDocument } from '@/utils/zod/document/keepOrUpdateDocument';

import { addGarantiesFinancièresToSchema } from '../../_helpers/addGarantiesFinancièresToSchema';

const schema = addGarantiesFinancièresToSchema(
  zod.object({
    identifiantProjet: zod.string().min(1),
    dateConstitution: zod.string().min(1, { message: 'Champ obligatoire' }),
    attestation: keepOrUpdateSingleDocument({ acceptedFileTypes: ['application/pdf'] }),
  }),
);

export type ModifierDépôtGarantiesFinancièresFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, data) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.GarantiesFinancières.ModifierDépôtGarantiesFinancièresEnCoursUseCase>(
      {
        type: 'Lauréat.GarantiesFinancières.UseCase.ModifierDépôtGarantiesFinancièresEnCours',
        data: {
          identifiantProjetValue: data.identifiantProjet,
          garantiesFinancièresValue: {
            type: data.type,
            dateÉchéance: data.type === 'avec-date-échéance' ? data.dateEcheance : undefined,
            dateDélibération: data.type === 'exemption' ? data.dateDeliberation : undefined,
          },
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
