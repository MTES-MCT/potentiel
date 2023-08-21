import { IsPeriodeLegacy } from '../../modules/appelOffre';
import { appelsOffreStatic } from './appelOffreStatic';

export const isPeriodeLegacy: IsPeriodeLegacy = async ({ appelOffreId, periodeId }) => {
  const appelOffre = appelsOffreStatic.find((ao) => ao.id === appelOffreId);

  if (!appelOffre) return false;

  const periode = appelOffre.periodes.find((periode) => periode.id === periodeId);

  return periode?.type === 'legacy';
};
