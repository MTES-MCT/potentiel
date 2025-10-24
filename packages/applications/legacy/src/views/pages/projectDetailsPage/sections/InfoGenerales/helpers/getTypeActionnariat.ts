import { Actionnariat } from '../../../../../../modules/project/types';

type GetTypeActionnariatProps = {
  actionnariat?: Actionnariat;
  isFinancementParticipatif: boolean;
  isInvestissementParticipatif: boolean;
};
export const getTypeActionnariat = ({
  actionnariat,
  isFinancementParticipatif,
  isInvestissementParticipatif,
}: GetTypeActionnariatProps) => {
  if (actionnariat) {
    if (actionnariat === 'financement-collectif') {
      return 'Financement collectif';
    }
    if (actionnariat === 'gouvernance-partagee') {
      return 'Gouvernance partagée';
    }
  }

  if (isFinancementParticipatif) {
    return 'Financement participatif';
  }

  if (isInvestissementParticipatif) {
    return 'Investissement participatif';
  }

  return undefined;
};
