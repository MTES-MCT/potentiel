import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { ConsulterProjetQuery } from '@potentiel-domain/candidature';
import { CahierDesCharges } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';
import { StatutProjet } from '@potentiel-domain/common';
import { InvalidOperationError } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import {
  DemanderAbandonPage,
  DemanderAbandonPageProps,
} from '@/components/pages/abandon/demander/DemanderAbandon.page';
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

    const candidature = await mediator.send<ConsulterProjetQuery>({
      type: 'Candidature.Query.ConsulterProjet',
      data: {
        identifiantProjet,
      },
    });

    if (Option.isNone(candidature)) {
      return notFound();
    }

    if (!StatutProjet.convertirEnValueType(candidature.statut).estClassé()) {
      throw new InvalidOperationError(
        `Vous ne pouvez pas demander l'abandon d'un projet non lauréat`,
      );
    }

    const appelOffre = await mediator.send<ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: candidature.appelOffre },
    });

    if (Option.isNone(appelOffre)) {
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
      appelOffre.periodes.find(({ id }) => id === candidature.période)
        ?.choisirNouveauCahierDesCharges &&
      cahierDesChargesChoisi === 'initial'
    ) {
      redirect(Routes.Projet.details(identifiantProjet));
    }

    const période = appelOffre.periodes.find((p) => p.id === candidature.période);
    if (!période) {
      return notFound();
    }

    // TODO: extract the logic in a dedicated function mapToProps
    // identifiantProjet must come from the readmodel as a value type
    const demanderAbandonPageProps: DemanderAbandonPageProps = {
      identifiantProjet,
      showRecandidatureCheckBox: période.abandonAvecRecandidature ? true : false,
    };

    return <DemanderAbandonPage {...{ ...demanderAbandonPageProps }} />;
  });
}
