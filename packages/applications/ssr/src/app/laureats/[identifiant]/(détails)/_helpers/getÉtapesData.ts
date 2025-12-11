import { DateTime } from '@potentiel-domain/common';

import { EtapesProjetProps } from '../(components)/EtapesProjetSection';

type GetÉtapesData = {
  dateNotification: DateTime.RawType;
  dateAchèvementPrévisionnel: DateTime.RawType;
  abandon?: {
    dateAbandonAccordé: DateTime.RawType;
    dateDemandeAbandon: DateTime.RawType;
  };
  dateAbandonAccordé?: DateTime.RawType;
  dateRecoursAccordé?: DateTime.RawType;
  dateMiseEnService?: DateTime.RawType;
  dateAchèvementRéel?: DateTime.RawType;
};

export const getÉtapesData = ({
  dateNotification,
  dateAchèvementPrévisionnel,
  abandon,
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

  if (abandon) {
    étapes.push({
      type: 'abandon',
      date: abandon.dateAbandonAccordé,
      dateDemande: abandon.dateDemandeAbandon,
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
