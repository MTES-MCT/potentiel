import ROUTES from '@routes';

import type { Action } from '../getProjectActionsByRole';
import { ProjectActionProps } from '../../components/Actions';

export const adminActions = (project: ProjectActionProps['project']) => {
  const canDownloadCertificate = !!project.certificateFile;

  const actions: Array<Action> = [];

  if (project.notifiedOn && project.certificateFile) {
    actions.push({
      title: 'Voir attestation',
      link: ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS({
        id: project.id,
        certificateFileId: project.certificateFile.id,
        email: project.email,
        potentielIdentifier: project.potentielIdentifier,
      }),
      isDownload: true,
      disabled: !canDownloadCertificate,
    });
  } else if (!project.isLegacy) {
    actions.push({
      title: 'Aperçu attestation',
      link: ROUTES.PREVIEW_CANDIDATE_CERTIFICATE(project),
      isDownload: true,
    });
  }

  return actions;
};
