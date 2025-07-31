import { mediator } from 'mediateur';
import { z } from 'zod';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Période } from '@potentiel-domain/periode';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { ImporterPériodePage } from './ImporterPériode.page';

const paramsSchema = z.object({
  reimport: z.any(),
});

type PageProps = {
  searchParams?: Record<string, string>;
};
export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    const { reimport } = paramsSchema.parse(searchParams);
    const périodes = await mediator.send<Période.ListerPériodesQuery>({
      type: 'Période.Query.ListerPériodes',
      data: {
        estNotifiée: reimport ? true : false,
      },
    });

    return PageWithErrorHandling(async () => (
      <ImporterPériodePage
        périodes={mapToPlainObject(
          périodes.items.toSorted((a, b) =>
            a.identifiantPériode.formatter().localeCompare(b.identifiantPériode.formatter()),
          ),
        )}
      />
    ));
  });
}
