import { DateTime } from '@potentiel-domain/common';

type GetÉtapesData = {
  dateNotification: DateTime.ValueType;
  dateAchèvementPrévisionnel: DateTime.ValueType;
  dateAbandonAccordé?: DateTime.ValueType;
  dateRecoursAccordé?: DateTime.ValueType;
  dateMiseEnService?: DateTime.ValueType;
  dateAchèvementRéel?: DateTime.ValueType;
};

type EtapesProjetProps = {
  identifiantProjet: string;
  doitAfficherAttestationDésignation: boolean;
  étapes: Array<{
    type:
      | 'designation'
      | 'achèvement-prévisionel'
      | 'mise-en-service'
      | 'achèvement-réel'
      | 'abandon'
      | 'recours';
    date: DateTime.ValueType;
  }>;
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
