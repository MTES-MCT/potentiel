'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { getCahierDesCharges } from '@/app/_helpers';
import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { keepOrUpdateSingleDocument } from '@/utils/zod/document/keepOrUpdateDocument';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  attestation: keepOrUpdateSingleDocument({ acceptedFileTypes: ['application/pdf'] }),
  rapportAssocie: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type EnregistrerAttestationConformitéFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, attestation, rapportAssocie },
) =>
  withUtilisateur(async (utilisateur) => {
    const cahierDesCharges = await getCahierDesCharges(
      IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
    );
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
        url: cahierDesCharges.estSoumisAuxGarantiesFinancières()
          ? Routes.GarantiesFinancières.détail(identifiantProjet)
          : Routes.Lauréat.détails.tableauDeBord(identifiantProjet),
        message: 'Votre attestation de conformité et son rapport associé ont bien été enregistrés',
      },
    };
  });

export const enregistrerAttestationConformitéAction = formAction(action, schema);
