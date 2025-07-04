import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { récupérerLauréatNonAbandonné } from '@/app/_helpers';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';
import { DemanderDélaiPage } from '@/components/pages/délai/demander/DemanderDélai.page';

export const metadata: Metadata = {
  title: 'Demander un délai exceptionnel - Potentiel',
  description: 'Formulaire de demande de délai',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const lauréat = await récupérerLauréatNonAbandonné(identifiantProjet);
    const { période } = await getPériodeAppelOffres(lauréat.identifiantProjet);

    const cahierDesChargesChoisi =
      await mediator.send<Lauréat.ConsulterCahierDesChargesChoisiQuery>({
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

    /**
     * TODO : Aller chercher la date d'achèvement prévisionnelle actuelle
     */

    return (
      <DemanderDélaiPage
        identifiantProjet={identifiantProjet}
        dateAchèvementPrévisionnelleActuelle={DateTime.now().formatter()}
      />
    );
  });
}
