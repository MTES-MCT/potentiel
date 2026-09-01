'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';
import { addGarantiesFinancièresToSchema } from '../../_helpers/addGarantiesFinancièresToSchema';

const schema = addGarantiesFinancièresToSchema(
  zod.object({
    identifiantProjet: zod.string().min(1),
    dateConstitution: zod.string(),
    attestation: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
  }),
);

export type SoumettreDépôtGarantiesFinancièresFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, props) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
      data: {
        identifiantProjetValue: props.identifiantProjet,
        typeValue: props.type,
        dateÉchéanceValue:
          props.type === 'avec-date-échéance'
            ? new Date(props.dateEcheance).toISOString()
            : undefined,
        dateConstitutionValue: new Date(props.dateConstitution).toISOString(),
        soumisLeValue: new Date().toISOString(),
        soumisParValue: utilisateur.identifiantUtilisateur.formatter(),

        attestationValue: props.attestation,
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.GarantiesFinancières.détail(props.identifiantProjet) },
    };
  });

export const soumettreDépôtGarantiesFinancièresAction = formAction(action, schema);
