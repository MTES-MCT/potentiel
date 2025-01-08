import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { CahierDesCharges } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import { DemanderAbandonPage } from '@/components/pages/abandon/demander/DemanderAbandon.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { récupérerProjet, vérifierQueLeProjetEstClassé } from '@/app/_helpers';

export const metadata: Metadata = {
  title: "Demander l'abandon du projet - Potentiel",
  description: "Formulaire d'abandon",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const { statut, appelOffre, période } = await récupérerProjet(identifiantProjet);

    await vérifierQueLeProjetEstClassé({
      statut,
      message: "Vous ne pouvez pas demander l'abandon d'un projet non lauréat",
    });

    const projetAppelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: appelOffre },
    });

    if (Option.isNone(projetAppelOffre)) {
      return notFound();
    }

    const cahierDesChargesChoisi =
      await mediator.send<CahierDesCharges.ConsulterCahierDesChargesChoisiQuery>({
        type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
        data: {
          identifiantProjet,
        },
      });

    if (Option.isNone(cahierDesChargesChoisi)) {
      return notFound();
    }

    if (
      projetAppelOffre.periodes.find(({ id }) => id === période)?.choisirNouveauCahierDesCharges &&
      cahierDesChargesChoisi.type === 'initial'
    ) {
      redirect(Routes.Projet.details(identifiantProjet));
    }

    return <DemanderAbandonPage identifiantProjet={identifiantProjet} />;
  });
}
