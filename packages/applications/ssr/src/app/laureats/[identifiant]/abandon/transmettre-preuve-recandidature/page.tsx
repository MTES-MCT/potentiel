import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import {
  ConsulterCandidatureQuery,
  ListerCandidaturesEligiblesPreuveRecanditureQuery,
} from '@potentiel-domain/candidature';
import { Abandon } from '@potentiel-domain/laureat';
import { Role, VérifierAccèsProjetQuery } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-libraries/routes';

import {
  TransmettrePreuveRecandidaturePage,
  TransmettrePreuveRecandidaturePageProps,
} from '@/components/pages/abandon/transmettrePreuveRecandidature/TransmettrePreuveRecandidaturePage';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const metadata: Metadata = {
  title: 'Transmettre preuve de recandidature - Potentiel',
  description: 'Formulaire de transmission de preuve de recandidature suite à un abandon',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
        type: 'CONSULTER_ABANDON_QUERY',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      const preuveDéjàTransmise = !!abandon.demande.preuveRecandidature;

      if (preuveDéjàTransmise) {
        redirect(Routes.Abandon.transmettrePreuveRecandidature(identifiantProjet));
      }

      const candidature = await mediator.send<ConsulterCandidatureQuery>({
        type: 'CONSULTER_CANDIDATURE_QUERY',
        data: {
          identifiantProjet,
        },
      });

      const projetsÀSélectionner =
        await mediator.send<ListerCandidaturesEligiblesPreuveRecanditureQuery>({
          type: 'LISTER_CANDIDATURES_ELIGIBLES_PREUVE_RECANDIDATURE_QUERY',
          data: {
            identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
          },
        });

      const transmettrePreuveRecandidaturePageProps: TransmettrePreuveRecandidaturePageProps = {
        projet: {
          ...candidature,
          identifiantProjet,
        },
        projetsÀSélectionner: projetsÀSélectionner
          .filter((p) => p.identifiantProjet.formatter() !== identifiantProjet)
          .map((projet) => ({
            ...projet,
            statut: projet.statut.statut,
            identifiantProjet: projet.identifiantProjet.formatter(),
          })),
      };

      return (
        <TransmettrePreuveRecandidaturePage {...{ ...transmettrePreuveRecandidaturePageProps }} />
      );
    }),
  );
}
