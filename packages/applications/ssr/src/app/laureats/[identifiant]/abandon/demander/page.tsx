import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { NotFoundError } from '@potentiel-domain/core';
import { CahierDesCharges } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import {
  DemanderAbandonPage,
  DemanderAbandonPageProps,
} from '@/components/pages/abandon/demander/DemanderAbandon.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { mapToProjetBannerProps } from '@/utils/mapToProjetBannerProps';

export const metadata: Metadata = {
  title: "Demander l'abandon du projet - Potentiel",
  description: "Formulaire d'abandon",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet,
      },
    });

    const appelOffre = await mediator.send<ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: candidature.appelOffre },
    });

    const { cahierDesChargesChoisi } =
      await mediator.send<CahierDesCharges.ConsulterCahierDesChargesChoisiQuery>({
        type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
        data: {
          identifiantProjet,
        },
      });

    if (
      appelOffre.periodes.find(({ id }) => id === candidature.période)
        ?.choisirNouveauCahierDesCharges &&
      cahierDesChargesChoisi === 'initial'
    ) {
      redirect(Routes.Projet.details(identifiantProjet));
    }

    const période = appelOffre.periodes.find((p) => p.id === candidature.période);
    if (!période) {
      throw new NotFoundError('Période de notification introuvable');
    }

    // TODO: extract the logic in a dedicated function mapToProps
    // identifiantProjet must come from the readmodel as a value type
    const demanderAbandonPageProps: DemanderAbandonPageProps = {
      projet: mapToProjetBannerProps({
        identifiantProjet,
        projet: candidature,
      }),
      showRecandidatureCheckBox: période.abandonAvecRecandidature ? true : false,
    };

    return <DemanderAbandonPage {...{ ...demanderAbandonPageProps }} />;
  });
}
