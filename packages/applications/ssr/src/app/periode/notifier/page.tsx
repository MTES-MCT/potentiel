import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { Période } from '@potentiel-domain/periode';

import {
  NotifierPériodePage,
  NotifierPériodePageProps,
} from '@/components/pages/période/notifier/NotifierPériode.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

type SearchParams = 'estNotifiee';

type PageProps = {
  searchParams?: Partial<Record<SearchParams, string>>;
};

export const metadata: Metadata = {
  title: 'Périodes - Notifier',
  description: 'Notifier une période',
};

export default async function Page({ searchParams }: PageProps) {
  const estNotifiée =
    searchParams?.estNotifiee === undefined ? undefined : searchParams.estNotifiee === 'true';

  return PageWithErrorHandling(async () => {
    const périodes = await mediator.send<Période.ListerPériodesQuery>({
      type: 'Période.Query.ListerPériodes',
      data: {
        estNotifiée,
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
