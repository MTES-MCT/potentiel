import { ProjectEvent } from '../projectEvent.model';

export type ProjectDCREvents = ProjectEvent &
  (
    | {
        type: 'ProjectDCRSubmitted';
        payload: {
          file?: {
            id: string;
            name: string;
          };
        };
      }
    | {
        type: 'ProjectDCRRemoved' | 'ProjectDCRDueDateSet';
        payload: null;
      }
  );
