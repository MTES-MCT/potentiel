import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { Historique } from '@potentiel-domain/historique';
import { DateTime } from '@potentiel-domain/common';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { AbandonHistoryRecord } from '@/components/molecules/historique/timeline/abandon';
import { HistoriqueLauréatPage } from '@/components/pages/lauréat/historique/HistoriqueLauréat.page';
import { TimelineItemProps } from '@/components/organisms/Timeline';

type PageProps = IdentifiantParameter;

export const metadata: Metadata = {
  title: 'Historique du projet',
  description: 'Historique du projet',
};

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const historique = await mediator.send<
      Historique.ListerHistoriqueProjetQuery<AbandonHistoryRecord>
    >({
      type: 'Historique.Query.ListerHistoriqueProjet',
      data: {
        identifiantProjet,
      },
    });

    return (
      <HistoriqueLauréatPage
        identifiantProjet={identifiantProjet}
        items={mapToTimelineItemProps(
          historique.items.filter(
            ({ type }) =>
              !type.includes('Importé') && !type.includes('GestionnaireRéseauInconnuAttribué'),
          ),
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
      />
    );
  });
}

const mapToTimelineItemProps = (
  items: Historique.ListerHistoriqueProjetReadModel<AbandonHistoryRecord>['items'],
): Array<TimelineItemProps> =>
  items.map(({ type, createdAt, payload }) => {
    return {
      title: type.replace(/[-V].*/, ''),
      date: getDate(payload) ?? DateTime.convertirEnValueType(createdAt).formatter(),
    };
  });

const getDate = (object: Record<string, unknown>): Iso8601DateTime | undefined => {
  let date: Iso8601DateTime | undefined = undefined;

  for (const name in object) {
    if (name.includes('Le') && typeof object[name] === 'string') {
      date = DateTime.convertirEnValueType(object[name]).formatter();
      break;
    }
  }

  return date;
};
