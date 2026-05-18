import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { getFournisseurInfos } from '../../../_helpers/getLauréat';
import { mapToFournisseurTimelineItemProps } from '../../(historique)/mapToFournisseurTimelineItemProps';
import { DétailsChangementFournisseurPage } from './DétailsChangementFournisseur.page';

export const metadata: Metadata = { title: 'Détail du changement de fournisseur' };

type PageProps = {
  params: Promise<{
    identifiant: string;
    date: string;
  }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { identifiant, date } = params;

  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));
    const enregistréLe = decodeParameter(date);
    const fournisseur = await getFournisseurInfos(identifiantProjet.formatter());

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
        technologie={fournisseur.technologie}
        évaluationCarboneSimplifiéeInitiale={fournisseur.évaluationCarboneSimplifiéeInitiale}
      />
    );
  });
}
