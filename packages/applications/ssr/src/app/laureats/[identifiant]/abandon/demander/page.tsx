import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { NotFoundError } from '@potentiel-domain/core';
import { CahierDesCharges } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-libraries/routes';
import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import {
  DemanderAbandonPage,
  DemanderAbandonPageProps,
} from '@/components/pages/abandon/demander/DemanderAbandonPage';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export const metadata: Metadata = {
  title: "Demander l'abandon du projet - Potentiel",
  description: "Formulaire d'abandon",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'CONSULTER_CANDIDATURE_QUERY',
      data: {
        identifiantProjet,
      },
    });

    const appelOffres = await mediator.send<ConsulterAppelOffreQuery>({
      type: 'CONSULTER_APPEL_OFFRE_QUERY',
      data: { identifiantAppelOffre: candidature.appelOffre },
    });

    const { cahierDesChargesChoisi } =
      await mediator.send<CahierDesCharges.ConsulterCahierDesChargesChoisiQuery>({
        type: 'CONSULTER_CAHIER_DES_CHARGES_QUERY',
        data: {
          identifiantProjet,
        },
      });

    if (appelOffres.choisirNouveauCahierDesCharges && cahierDesChargesChoisi === 'initial') {
      redirect(Routes.Projet.details(identifiantProjet));
    }

    const période = appelOffres.periodes.find((p) => p.id === candidature.période);
    if (!période) {
      throw new NotFoundError('Période de notification introuvable');
    }

    // TODO: extract the logic in a dedicated function mapToProps
    // identifiantProjet must come from the readmodel as a value type
    const demanderAbandonPageProps: DemanderAbandonPageProps = {
      projet: { ...candidature, identifiantProjet },
      showRecandidatureCheckBox: période.abandonAvecRecandidature ? true : false,
    };

    return <DemanderAbandonPage {...{ ...demanderAbandonPageProps }} />;
  });
}
