import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { Historique } from '@potentiel-domain/historique';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { HistoriqueLauréatPage } from '@/components/pages/lauréat/historique/HistoriqueLauréat.page';

type PageProps = IdentifiantParameter;

export const metadata: Metadata = {
  title: 'Historique du projet',
  description: 'Historique du projet',
};

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const historique = await mediator.send<Historique.ListerHistoriqueProjetQuery>({
      type: 'Historique.Query.ListerHistoriqueProjet',
      data: {
        identifiantProjet,
      },
    });

    return <HistoriqueLauréatPage identifiantProjet={identifiantProjet} historique={historique} />;
  });
}
