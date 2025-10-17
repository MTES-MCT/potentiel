import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDateAchèvementPrévisionnelCalculéeProps = (
  event: Lauréat.Achèvement.DateAchèvementPrévisionnelCalculéeEvent,
): TimelineItemProps => {
  const { date, raison } = event.payload;

  return {
    date,
    title: getTitleFromRaison(raison),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Durée : <span className="font-semibold">{getNombreDeMois(raison)} mois</span>
        </div>
        <div>
          Date d'achèvement prévisionnel :{' '}
          <FormattedDate
            className="font-semibold"
            date={DateTime.convertirEnValueType(date).formatter()}
          />
        </div>
      </div>
    ),
  };
};

const getNombreDeMois = (
  raison: Lauréat.Achèvement.DateAchèvementPrévisionnelCalculéeEvent['payload']['raison'],
) =>
  match(raison)
    .with('ajout-délai-cdc-30_08_2022', () => 18)
    .with('retrait-délai-cdc-30_08_2022', () => 18)
    .with('covid', () => 7)
    .otherwise(() => undefined);

const getTitleFromRaison = (
  raison: Lauréat.Achèvement.DateAchèvementPrévisionnelCalculéeEvent['payload']['raison'],
) =>
  match(raison)
    .with('ajout-délai-cdc-30_08_2022', () => (
      <>
        Attribution d'un délai supplémentaire prévu dans le{' '}
        <span className="font-semibold">cahier des charges rétroactif du 30/08/2022</span>
      </>
    ))
    .with('retrait-délai-cdc-30_08_2022', () => (
      <>
        Retrait d'un délai supplémentaire prévu dans le{' '}
        <span className="font-semibold">cahier des charges rétroactif du 30/08/2022</span>
      </>
    ))
    .with('covid', () => (
      <>
        Attribution d'un délai supplémentaire dû à la{' '}
        <span className="font-semibold">crise du COVID</span>
      </>
    ))
    .otherwise(() => undefined);
