'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Achèvement, GarantiesFinancières } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Raccordement } from '@potentiel-domain/reseau';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { document } from '@/utils/zod/documentTypes';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  attestation: document,
  preuveTransmissionAuCocontractant: document,
  dateTransmissionAuCocontractant: zod.string().min(1, { message: 'Champ obligatoire' }),
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

    const raccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    const aDéjàTransmisUnDossierDeRaccordement =
      Option.isSome(raccordement) && raccordement.dossiers.length > 0;

    if (aDéjàTransmisUnDossierDeRaccordement) {
      const searchParams = new URLSearchParams({
        success: `Votre attestation de conformité a bien été transmise`,
        redirectUrl: Routes.Projet.details(identifiantProjet),
        redirectTitle: 'Retourner à la page projet',
      });
      const redirectUrl = `/confirmation.html?${searchParams}`;
      return {
        status: 'success',
        redirectUrl,
      };
    }

    return {
      status: 'success',
      redirectUrl: Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet),
    };
  });

export const transmettreAttestationConformitéAction = formAction(action, schema);
