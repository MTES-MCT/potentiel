import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';
import { Éliminé } from '@potentiel-domain/projet';
import { InvalidOperationError } from '@potentiel-domain/core';

import { DemanderRecoursPage } from '@/components/pages/recours/demander/DemanderRecours.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export const metadata: Metadata = {
  title: 'Demander un recours pour le projet - Potentiel',
  description: 'Formulaire de recours',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
      type: 'Éliminé.Query.ConsulterÉliminé',
      data: {
        identifiantProjet,
      },
    });

    if (Option.isNone(éliminé)) {
      throw new InvalidOperationError(
        "Vous ne pouvez pas demander le recours d'un projet non éliminé",
      );
    }

    const projetAppelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: éliminé.identifiantProjet.appelOffre },
    });

    if (Option.isNone(projetAppelOffre)) {
      return notFound();
    }

    const projetPériode = projetAppelOffre.periodes.find(
      (p) => p.id === éliminé.identifiantProjet.période,
    );

    if (!projetPériode) {
      return notFound();
    }

    return <DemanderRecoursPage identifiantProjet={identifiantProjet} />;
  });
}
