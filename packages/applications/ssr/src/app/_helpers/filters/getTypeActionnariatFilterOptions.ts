import { Candidature } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { getActionnariatTypeLabel } from '../getActionnariatTypeLabel';

export const getTypeActionnariatFilterOptions = (
  cycleAppelOffre?: AppelOffre.ConsulterAppelOffreReadModel['cycleAppelOffre'],
) =>
  cycleAppelOffre === 'PPE2'
    ? Candidature.TypeActionnariat.ppe2Types.map((t) => ({
        label: getActionnariatTypeLabel(t),
        value: t,
      }))
    : cycleAppelOffre === 'CRE4'
      ? Candidature.TypeActionnariat.cre4Types.map((t) => ({
          label: getActionnariatTypeLabel(t),
          value: t,
        }))
      : Candidature.TypeActionnariat.types.map((t) => ({
          label: getActionnariatTypeLabel(t),
          value: t,
        }));
