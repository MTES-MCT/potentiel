import { ProjectEvent } from '..'

export type ProjectCertificateEvents = ProjectEvent & {
  type:
    | 'ProjectCertificateGenerated'
    | 'ProjectCertificateRegenerated'
    | 'ProjectCertificateUpdated'
  payload: { certificateFileId: string }
}
