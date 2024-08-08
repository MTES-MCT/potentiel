import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { ListerProjetsEligiblesPreuveRecanditureQuery } from '@potentiel-domain/candidature';
import { Abandon } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import {
  TransmettrePreuveRecandidaturePage,
  TransmettrePreuveRecandidaturePageProps,
} from '@/components/pages/abandon/transmettrePreuveRecandidature/TransmettrePreuveRecandidature.page';
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

      const preuveDéjàTransmise = !!abandon.demande.preuveRecandidature;

      if (preuveDéjàTransmise) {
        redirect(Routes.Abandon.transmettrePreuveRecandidature(identifiantProjet));
      }

      const projetsÀSélectionner =
        await mediator.send<ListerProjetsEligiblesPreuveRecanditureQuery>({
          type: 'Candidature.Query.ListerProjetsEligiblesPreuveRecandidature',
          data: {
            identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
          },
        });

      const transmettrePreuveRecandidaturePageProps: TransmettrePreuveRecandidaturePageProps = {
        identifiantProjet,
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
