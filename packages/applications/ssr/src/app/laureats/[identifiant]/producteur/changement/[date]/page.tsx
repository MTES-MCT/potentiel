import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Producteur } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Historique } from '@potentiel-domain/historique';

import { DétailsProducteurPage } from '@/components/pages/producteur/changement/détails/DétailsProducteur.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { ProducteurHistoryRecord } from '@/components/pages/producteur/changement/détails/timeline';

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

    const changement = await mediator.send<Producteur.ConsulterChangementProducteurQuery>({
      type: 'Lauréat.Producteur.Query.ConsulterChangementProducteur',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
        enregistréLe,
      },
    });

    if (Option.isNone(changement)) {
      return notFound();
    }

    const historique = await mediator.send<
      Historique.ListerHistoriqueProjetQuery<ProducteurHistoryRecord>
    >({
      type: 'Historique.Query.ListerHistoriqueProjet',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
        category: 'producteur',
      },
    });

    return (
      <DétailsProducteurPage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        changement={mapToPlainObject(changement.changement)}
        historique={mapToPlainObject(historique)}
      />
    );
  });
}
