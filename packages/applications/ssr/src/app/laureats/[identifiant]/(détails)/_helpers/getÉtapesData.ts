import { DateTime } from '@potentiel-domain/common';

import { EtapesProjetProps } from '../(components)/EtapesProjetSection';

type GetÉtapesData = {
  dateNotification: DateTime.RawType;
  dateAchèvementPrévisionnel: DateTime.RawType;
  dateAbandonAccordé?: DateTime.RawType;
  dateRecoursAccordé?: DateTime.RawType;
  dateMiseEnService?: DateTime.RawType;
  dateAchèvementRéel?: DateTime.RawType;
};

export const getÉtapesData = ({
  dateNotification,
  dateAchèvementPrévisionnel,
  dateAbandonAccordé,
  dateRecoursAccordé,
  dateAchèvementRéel,
  dateMiseEnService,
}: GetÉtapesData) => {
  const étapes: EtapesProjetProps['étapes'] = [
    {
      type: 'designation',
      date: dateNotification,
    },
  ];

  if (dateAbandonAccordé) {
    étapes.push({
      type: 'abandon',
      date: dateAbandonAccordé,
    });

    return étapes;
  }

  étapes.push({
    type: 'achèvement-prévisionel',
    date: dateAchèvementPrévisionnel,
  });

  if (dateRecoursAccordé) {
    étapes.push({
      type: 'recours',
      date: dateRecoursAccordé,
    });
  }

  if (dateMiseEnService) {
    étapes.push({
      type: 'mise-en-service',
      date: dateMiseEnService,
    });
  }

  if (dateAchèvementRéel) {
    étapes.push({
      type: 'achèvement-réel',
      date: dateAchèvementRéel,
    });
  }

  return étapes;
};
