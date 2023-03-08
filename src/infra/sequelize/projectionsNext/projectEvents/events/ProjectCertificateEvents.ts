import { ProjectEvent } from '../projectEvent.model';

export type ProjectCertificateEvents = ProjectEvent & {
  type:
    | 'ProjectCertificateGenerated'
    | 'ProjectCertificateRegenerated'
    | 'ProjectCertificateUpdated';
  payload: { certificateFileId: string };
};
