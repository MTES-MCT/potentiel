import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export const mapToLegacyDélaiAccordéTimelineItemProps = (
  délaiAccordé: Lauréat.Délai.LegacyDélaiAccordéEvent,
) => {
  const { accordéLe, nombreDeMois, raison } = délaiAccordé.payload;

  return {
    date: accordéLe,
    title: <div>{getTitleFromRaison(raison)}</div>,
    content: (
      <>
        Durée : <span className="font-semibold">{nombreDeMois} mois</span>
      </>
    ),
  };
};

const getTitleFromRaison = (raison: Lauréat.Délai.LegacyDélaiAccordéEvent['payload']['raison']) =>
  match(raison)
    .with('demande', () => `Demande de délai exceptionnel accordée par l'administration`)
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
