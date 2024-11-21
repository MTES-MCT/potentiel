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
import { singleDocument } from '@/utils/zod/document';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  attestation: singleDocument(),
  preuveTransmissionAuCocontractant: singleDocument(),
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
        attestationValue: attestation,
        preuveTransmissionAuCocontractantValue: preuveTransmissionAuCocontractant,
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

    return {
      status: 'success',
      redirectUrl: aDéjàTransmisUnDossierDeRaccordement
        ? Routes.Projet.details(identifiantProjet)
        : Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet),
      successMessage: 'Votre attestation de conformité a bien été transmise',
    };
  });

export const transmettreAttestationConformitéAction = formAction(action, schema);
