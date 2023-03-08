import { ProjectEvent } from '../projectEvent.model';

export type ProjectClaimedEvent = ProjectEvent & {
  type: 'ProjectClaimed';
  payload: {
    attestationDesignationFileId: string;
    claimedBy: string;
  };
};
