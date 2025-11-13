'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';
import { manyDocuments } from '@/utils//zod/document/manyDocuments';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  attestation: manyDocuments({ acceptedFileTypes: ['application/pdf'] }),
  preuveTransmissionAuCocontractant: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
  dateTransmissionAuCocontractant: zod.string().min(1),
  demanderMainlevee: zod.string().optional(),
});

export type TransmettreAttestationConformitéFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    attestation,
    dateTransmissionAuCocontractant,
    preuveTransmissionAuCocontractant,
    demanderMainlevee,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Achèvement.TransmettreAttestationConformitéUseCase>({
      type: 'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
      data: {
        identifiantProjetValue: identifiantProjet,
        attestationValue: attestation,
        preuveTransmissionAuCocontractantValue: preuveTransmissionAuCocontractant,
        dateTransmissionAuCocontractantValue: new Date(
          dateTransmissionAuCocontractant,
        ).toISOString(),
        dateValue: new Date().toISOString(),
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    if (demanderMainlevee === 'true') {
      await mediator.send<Lauréat.GarantiesFinancières.DemanderMainlevéeGarantiesFinancièresUseCase>(
        {
          type: 'Lauréat.GarantiesFinancières.UseCase.DemanderMainlevée',
          data: {
            identifiantProjetValue: identifiantProjet,
            motifValue: 'projet-achevé',
            demandéLeValue: DateTime.now().formatter(),
            demandéParValue: utilisateur.identifiantUtilisateur.formatter(),
          },
        },
      );
    }

    const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
      type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    const aDéjàTransmisUnDossierDeRaccordement =
      Option.isSome(raccordement) && raccordement.dossiers.length > 0;

    return {
      status: 'success',
      redirection: {
        url: aDéjàTransmisUnDossierDeRaccordement
          ? Routes.Projet.details(identifiantProjet)
          : Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet),
        message: 'Votre attestation de conformité a bien été transmise',
      },
    };
  });

export const transmettreAttestationConformitéAction = formAction(action, schema);
