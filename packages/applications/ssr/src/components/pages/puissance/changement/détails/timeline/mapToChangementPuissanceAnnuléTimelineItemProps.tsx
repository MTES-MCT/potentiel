import { Lauréat } from '@potentiel-domain/projet';

import { PuissanceHistoryRecord } from '.';

export const mapToChangementPuissanceAnnuléTimelineItemProps = (record: PuissanceHistoryRecord) => {
  const { annuléLe, annuléPar } =
    record.payload as Lauréat.Puissance.ChangementPuissanceAnnuléEvent['payload'];

  return {
    date: annuléLe,
    title: (
      <div>
        Changement de puissance annulé par {<span className="font-semibold">{annuléPar}</span>}
      </div>
    ),
  };
};
