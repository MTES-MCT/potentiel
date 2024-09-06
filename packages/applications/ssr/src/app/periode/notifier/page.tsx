import { mediator } from 'mediateur';

import { Période } from '@potentiel-domain/periode';

import {
  NotifierPériodePage,
  NotifierPériodePageProps,
} from '@/components/pages/période/notifier/NotifierPériode.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export default async function Page() {
  return PageWithErrorHandling(async () => {
    const périodes = await mediator.send<Période.ListerPériodesQuery>({
      type: 'Période.Query.ListerPériodes',
      data: {
        estNotifiée: false,
      },
    });

    return <NotifierPériodePage périodes={mapToProps(périodes)} />;
  });
}

const mapToProps = (
  readModel: Période.ListerPériodesReadModel,
): NotifierPériodePageProps['périodes'] =>
  readModel.items.map((période) => ({
    appelOffre: période.identifiantPériode.appelOffre,
    période: période.identifiantPériode.période,
  }));
