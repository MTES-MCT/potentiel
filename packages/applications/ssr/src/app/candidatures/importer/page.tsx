import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { ImporterCandidaturesPage } from '@/components/pages/candidature/importer/ImporterCandidatures.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export default async function Page() {
  const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
    type: 'AppelOffre.Query.ListerAppelOffre',
    data: {},
  });
  return PageWithErrorHandling(async () => (
    <ImporterCandidaturesPage
      appelOffres={appelOffres.items.map((ao) => ({
        id: ao.id,
        nom: ao.id,
        période: ao.periodes.map((p) => ({ id: p.id, nom: p.title })),
      }))}
    />
  ));
}
