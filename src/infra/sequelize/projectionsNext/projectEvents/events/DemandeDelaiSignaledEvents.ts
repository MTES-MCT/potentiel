import { ProjectEvent } from '..';

export type DemandeDelaiSignaledEvent = ProjectEvent & {
  type: 'DemandeDelaiSignaled';
  payload: {
    signaledBy: string;
    attachment?: { id: string; name: string };
    notes?: string;
  } & (
    | {
        status: 'rejetée' | 'accord-de-principe';
      }
    | {
        status: 'acceptée';
        oldCompletionDueOn?: number;
        newCompletionDueOn: number;
      }
  );
};
