import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Historique } from '@potentiel-domain/historique';

import { DétailsFournisseurPage } from '@/components/pages/fournisseur/changement/détails/DétailsFournisseur.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { FournisseurHistoryRecord } from '@/components/pages/fournisseur/changement/détails/timeline';

export const metadata: Metadata = {
  title: 'Détail du fournisseur du projet - Potentiel',
  description: 'Détail du fournisseur du projet',
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

    const historique = await mediator.send<
      Historique.ListerHistoriqueProjetQuery<FournisseurHistoryRecord>
    >({
      type: 'Historique.Query.ListerHistoriqueProjet',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
        category: 'fournisseur',
      },
    });

    return (
      <DétailsFournisseurPage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        changement={mapToPlainObject(changement.changement)}
        historique={mapToPlainObject(historique)}
      />
    );
  });
}
