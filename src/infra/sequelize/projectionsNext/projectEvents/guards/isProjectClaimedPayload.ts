import { Payload } from '../Payload'

type ProjectClaimedPayload = {
  attestationDesignationFileId: string
  claimedBy: string
}

export const isProjectClaimedPayload = (
  payload: Payload | null
): payload is ProjectClaimedPayload =>
  typeof payload?.attestationDesignationFileId === 'string' &&
  typeof payload?.claimedBy === 'string'
