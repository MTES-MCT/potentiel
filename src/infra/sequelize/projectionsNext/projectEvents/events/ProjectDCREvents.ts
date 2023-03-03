import { ProjectEvent } from '..';

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
