'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

import { addGarantiesFinancièresToSchema } from '../../_helpers/addGarantiesFinancièresToSchema';

const schema = addGarantiesFinancièresToSchema(
  zod.object({
    identifiantProjet: zod.string().min(1),
    dateConstitution: zod.string().min(1, { message: 'Champ obligatoire' }),
    attestation: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
  }),
);

export type EnregistrerGarantiesFinancièresFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, props) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.GarantiesFinancières.EnregistrerGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
      data: {
        identifiantProjetValue: props.identifiantProjet,
        garantiesFinancièresValue: {
          type: props.type,
          dateÉchéance:
            props.type === 'avec-date-échéance'
              ? new Date(props.dateEcheance).toISOString()
              : undefined,
          dateDélibération:
            props.type === 'exemption' ? new Date(props.dateDeliberation).toISOString() : undefined,
        },
        dateConstitutionValue: new Date(props.dateConstitution).toISOString(),
        attestationValue: props.attestation,
        enregistréLeValue: new Date().toISOString(),
        enregistréParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.GarantiesFinancières.détail(props.identifiantProjet) },
    };
  });

export const enregistrerGarantiesFinancièresAction = formAction(action, schema);
