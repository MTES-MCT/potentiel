import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { récupérerLauréatSansAbandon } from '@/app/_helpers';
import { getPériodeAppelOffres } from '@/app/_helpers';

import { DemanderDélaiPage } from './DemanderDélai.page';

export const metadata: Metadata = {
  title: 'Demander un délai exceptionnel - Potentiel',
  description: 'Formulaire de demande de délai',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const lauréat = await récupérerLauréatSansAbandon(identifiantProjet);
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
      redirect(
        Routes.Projet.details(identifiantProjet, {
          type: 'error',
          message: 'Votre cahier des charges actuel empêche la demande de délai',
        }),
      );
    }

    const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
      type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    if (Option.isNone(achèvement)) {
      return notFound();
    }

    return (
      <DemanderDélaiPage
        identifiantProjet={identifiantProjet}
        dateAchèvementPrévisionnelActuelle={achèvement.dateAchèvementPrévisionnel.formatter()}
      />
    );
  });
}
