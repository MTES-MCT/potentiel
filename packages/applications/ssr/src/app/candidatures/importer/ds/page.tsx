import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { mapToPlainObject } from '@potentiel-domain/core';

import { ImporterDémarchesPage } from './ImporterDémarches.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export default async function Page() {
  const appelsOffre = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
    type: 'AppelOffre.Query.ListerAppelOffre',
    data: {},
  });
  return PageWithErrorHandling(async () => (
    <ImporterDémarchesPage
      appelsOffre={mapToPlainObject(
        appelsOffre.items
          .filter((ao) => ao.cycleAppelOffre === 'PPE2')
          .sort((ao1, ao2) => ao1.id.localeCompare(ao2.id)),
      )}
    />
  ));
}
