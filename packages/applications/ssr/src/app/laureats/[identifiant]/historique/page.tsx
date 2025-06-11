import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { Historique } from '@potentiel-domain/historique';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { HistoriqueLauréatPage } from '@/components/pages/lauréat/historique/HistoriqueLauréat.page';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';

type PageProps = IdentifiantParameter;

export const metadata: Metadata = {
  title: 'Historique du projet',
  description: 'Historique du projet',
};

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const candidature = await getCandidature(identifiantProjet);

    const historique = await mediator.send<Historique.ListerHistoriqueProjetQuery>({
      type: 'Historique.Query.ListerHistoriqueProjet',
      data: {
        identifiantProjet,
      },
    });

    return (
      <HistoriqueLauréatPage
        identifiantProjet={identifiantProjet}
        unitéPuissance={candidature.unitéPuissance.formatter()}
        historique={historique.items
          .filter((historique) => !historique.type.includes('Import'))
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())}
      />
    );
  });
}
