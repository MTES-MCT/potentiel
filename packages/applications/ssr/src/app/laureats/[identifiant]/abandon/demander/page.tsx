import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { CahierDesCharges } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import { DemanderAbandonPage } from '@/components/pages/abandon/demander/DemanderAbandon.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { récupérerLauréatNonAbandonné } from '@/app/_helpers';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';

export const metadata: Metadata = {
  title: "Demander l'abandon du projet - Potentiel",
  description: "Formulaire d'abandon",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const lauréat = await récupérerLauréatNonAbandonné(identifiantProjet);
    const { période } = await getPériodeAppelOffres(lauréat.identifiantProjet);

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

    if (période?.choisirNouveauCahierDesCharges && cahierDesChargesChoisi.type === 'initial') {
      redirect(Routes.Projet.details(identifiantProjet));
    }

    return <DemanderAbandonPage identifiantProjet={identifiantProjet} />;
  });
}
