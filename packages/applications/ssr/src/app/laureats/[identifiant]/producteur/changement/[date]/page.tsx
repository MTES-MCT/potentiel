import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { DétailsProducteurPage } from '@/components/pages/producteur/changement/détails/DétailsProducteur.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { mapToProducteurTimelineItemProps } from '@/utils/historique/mapToProps/producteur/mapToProducteurTimelineItemProps';

export const metadata: Metadata = {
  title: 'Détail du producteur du projet - Potentiel',
  description: 'Détail du producteur du projet',
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

    const changement = await mediator.send<Lauréat.Producteur.ConsulterChangementProducteurQuery>({
      type: 'Lauréat.Producteur.Query.ConsulterChangementProducteur',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
        enregistréLe,
      },
    });

    if (Option.isNone(changement)) {
      return notFound();
    }

    const historique =
      await mediator.send<Lauréat.Producteur.ListerHistoriqueProducteurProjetQuery>({
        type: 'Lauréat.Producteur.Query.ListerHistoriqueProducteurProjet',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    return (
      <DétailsProducteurPage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        changement={mapToPlainObject(changement.changement)}
        historique={historique.items.map(mapToProducteurTimelineItemProps)}
      />
    );
  });
}
