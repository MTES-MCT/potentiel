import { ProjectAppelOffre } from '../../../entities';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export type GetProjectAppelOffre = (args: {
  appelOffreId: string;
  periodeId: string;
  familleId?: string;
}) => ProjectAppelOffre | undefined;

export const makeGetProjectAppelOffre: (
  appelsOffre: AppelOffre.AppelOffreReadModel[],
) => GetProjectAppelOffre =
  (appelsOffres) =>
  ({ appelOffreId, periodeId, familleId }) => {
    const appelOffre = appelsOffres.find((ao) => ao.id === appelOffreId);

    if (!appelOffre) return undefined;

    const periode = appelOffre.periodes.find((periode) => periode.id === periodeId);

    if (!periode) return undefined;

    const famille = periode.familles.find((famille) => famille.id === familleId);

    return {
      ...appelOffre,
      periode,
      famille,
      isSoumisAuxGF: famille
        ? famille.garantiesFinancières.soumisAuxGarantiesFinancieres !== 'non soumis'
        : appelOffre.garantiesFinancières.soumisAuxGarantiesFinancieres !== 'non soumis',
    };
  };
