import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { NotifierCandidaturesPage } from '@/components/pages/candidature/notifier/NotifierCandidatures.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export default async function Page() {
  const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
    type: 'AppelOffre.Query.ListerAppelOffre',
    data: {},
  });
  return PageWithErrorHandling(async () => (
    <NotifierCandidaturesPage
      appelOffres={appelOffres.items.map(({ id, periodes }) => ({
        id: id,
        nom: id,
        périodes: periodes.map((p) => ({
          id: p.id,
          nom: p.title,
        })),
      }))}
    />
  ));
}
