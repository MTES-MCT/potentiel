import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

import { DemanderRecoursPage } from '@/components/pages/recours/demander/DemanderRecours.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { récupérerProjet, vérifierQueLeProjetEstÉliminé } from '@/app/_helpers';

export const metadata: Metadata = {
  title: 'Demander un recours pour le projet - Potentiel',
  description: 'Formulaire de recours',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const { statut, appelOffre, période } = await récupérerProjet(identifiantProjet);

    vérifierQueLeProjetEstÉliminé({
      statut,
      message: "Vous ne pouvez pas demander le recours d'un projet non éliminé",
    });

    const projetAppelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: appelOffre },
    });

    if (Option.isNone(projetAppelOffre)) {
      return notFound();
    }

    const projetPériode = projetAppelOffre.periodes.find((p) => p.id === période);

    if (!projetPériode) {
      return notFound();
    }

    return <DemanderRecoursPage identifiantProjet={identifiantProjet} />;
  });
}
