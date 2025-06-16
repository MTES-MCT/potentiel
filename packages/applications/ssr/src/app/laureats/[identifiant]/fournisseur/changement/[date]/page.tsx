import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { DétailsChangementFournisseurPage as DétailsChangementFournisseurPage } from '@/components/pages/fournisseur/changement/détails/DétailsChangementFournisseur.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';
import { mapToFournisseurTimelineItemProps } from '@/utils/historique/mapToProps/fournisseur';

import { getTechnologie } from '../../_helpers/getTechnologie';

export const metadata: Metadata = {
  title: 'Détail du changement de fournisseur du projet - Potentiel',
  description: 'Détail du changement de fournisseur du projet',
};

type PageProps = {
  params: {
    identifiant: string;
    date: string;
  };
};

export default async function Page({ params: { identifiant, date } }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));
    const enregistréLe = decodeParameter(date);
    const candidature = await getCandidature(identifiantProjet.formatter());
    const { appelOffres } = await getPériodeAppelOffres(identifiantProjet);
    const technologie = getTechnologie({ appelOffres, technologie: candidature.technologie });

    const changement = await mediator.send<Lauréat.Fournisseur.ConsulterChangementFournisseurQuery>(
      {
        type: 'Lauréat.Fournisseur.Query.ConsulterChangementFournisseur',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          enregistréLe,
        },
      },
    );

    if (Option.isNone(changement)) {
      return notFound();
    }

    const historique =
      await mediator.send<Lauréat.Fournisseur.ListerHistoriqueFournisseurProjetQuery>({
        type: 'Lauréat.Fournisseur.Query.ListerHistoriqueFournisseurProjet',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    return (
      <DétailsChangementFournisseurPage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        changement={mapToPlainObject(changement.changement)}
        historique={historique.items.map(mapToFournisseurTimelineItemProps)}
        technologie={technologie}
        évaluationCarboneSimplifiéeInitiale={candidature.evaluationCarboneSimplifiée}
      />
    );
  });
}
