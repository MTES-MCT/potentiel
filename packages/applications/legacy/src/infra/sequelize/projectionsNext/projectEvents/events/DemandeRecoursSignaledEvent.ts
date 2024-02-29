import { ProjectEvent } from '../projectEvent.model';

export type DemandeRecoursSignaledEvent = ProjectEvent & {
  type: 'DemandeRecoursSignaled';
  payload: {
    signaledBy: string;
    status: 'acceptée' | 'rejetée';
    attachment?: { id: string; name: string };
    notes?: string;
  };
};
