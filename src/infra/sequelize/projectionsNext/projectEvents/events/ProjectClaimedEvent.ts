import { ProjectEvent } from '..'

export type ProjectClaimedEvent = ProjectEvent & {
  type: 'ProjectClaimed'
  payload: {
    attestationDesignationFileId: string
    claimedBy: string
  }
}
