import { Données, StatistiquesUtilisation } from '../../infra/sequelize/tables';

type MiseAJourStatistiquesUtilisationArgs = {
  type: string;
  données: Données;
};

export const miseAJourStatistiquesUtilisation = ({
  type,
  données,
}: MiseAJourStatistiquesUtilisationArgs) => {
  StatistiquesUtilisation.create({ type, données });
};
