import { ProjectEvent } from '../projectEvent.model';

export type DateFileAttenteEvent = ProjectEvent & {
  type: 'DateFileAttente';
  payload: { dateFileAttente: string };
};
