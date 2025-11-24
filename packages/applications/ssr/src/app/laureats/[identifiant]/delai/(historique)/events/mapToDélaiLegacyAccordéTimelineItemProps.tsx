import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToLegacyDélaiAccordéTimelineItemProps = (
  event: Lauréat.Délai.LegacyDélaiAccordéEvent,
): TimelineItemProps => {
  const { accordéLe, nombreDeMois, raison } = event.payload;

  return {
    date: accordéLe,
    title: getTitleFromRaison(raison),
    content: (
      <>
        Durée : <span className="font-semibold">{nombreDeMois} mois</span>
      </>
    ),
  };
};

const getTitleFromRaison = (raison: Lauréat.Délai.LegacyDélaiAccordéEvent['payload']['raison']) =>
  match(raison)
    .with('demande', () => `Demande de délai de force majeure accordée par l'administration`)
    .with('cdc-18-mois', () => (
      <>
        Attribution d'un délai supplémentaire prévu dans le{' '}
        <span className="font-semibold">cahier des charges rétroactif du 30/08/2022</span>
      </>
    ))
    .with('covid', () => (
      <>
        Attribution d'un délai supplémentaire dû à la{' '}
        <span className="font-semibold">crise du COVID</span>
      </>
    ))
    .exhaustive();
