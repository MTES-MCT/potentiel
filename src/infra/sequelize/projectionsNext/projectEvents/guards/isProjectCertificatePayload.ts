import { Payload } from '../Payload'

type ProjectCertificatePayload = {
  certificateFileId: string
}

export const isProjectCertificatePayload = (
  payload: Payload | null
): payload is ProjectCertificatePayload => typeof payload?.certificateFileId === 'string'
