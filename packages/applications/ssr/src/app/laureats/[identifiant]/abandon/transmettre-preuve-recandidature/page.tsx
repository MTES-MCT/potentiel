import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { Candidature } from '@potentiel-domain/candidature';
import { Abandon } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { TransmettrePreuveRecandidaturePage } from '@/components/pages/abandon/transmettrePreuveRecandidature/TransmettrePreuveRecandidature.page';
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
        type: 'Lauréat.Abandon.Query.ConsulterAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      if (Option.isNone(abandon)) {
        return notFound();
      }

      if (abandon.demande.recandidature?.preuve?.identifiantProjet) {
        const identifiantPreuveRecandidature = IdentifiantProjet.bind(
          abandon.demande.recandidature.preuve?.identifiantProjet,
        );
        redirect(
          Routes.Abandon.transmettrePreuveRecandidature(identifiantPreuveRecandidature.formatter()),
        );
      }

      const projetsEligiblesPreuveRecandidature =
        await mediator.send<Candidature.ListerProjetsEligiblesPreuveRecanditureQuery>({
          type: 'Candidature.Query.ListerProjetsEligiblesPreuveRecandidature',
          data: {
            identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
          },
        });

      const projetsÀSélectionner = projetsEligiblesPreuveRecandidature
        .filter((p) => p.identifiantProjet.formatter() !== identifiantProjet)
        .map((projet) => ({
          ...projet,
          statut: projet.statut.statut,
          identifiantProjet: projet.identifiantProjet.formatter(),
        }));

      return (
        <TransmettrePreuveRecandidaturePage
          identifiantProjet={identifiantProjet}
          projetsÀSélectionner={projetsÀSélectionner}
        />
      );
    }),
  );
}
