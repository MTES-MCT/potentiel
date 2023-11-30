import { stableStringify } from '../../../core/utils';
import { Project } from '../../../entities';
import { Periode, AppelOffre } from '@potentiel-domain/appel-offre';

export const makeCandidateNotificationId = (args: {
  appelOffreId: AppelOffre['id'];
  periodeId: Periode['id'];
  candidateEmail: Project['email'];
}) => {
  const { appelOffreId, periodeId, candidateEmail } = args;
  const key = { appelOffreId, periodeId, candidateEmail };

  return stableStringify(key);
};
