import { ProjectEvent } from '../projectEvent.model';

export type DateMiseEnServicePayload =
  | { statut: 'renseignée'; dateMiseEnService: string }
  | { statut: 'non-renseignée' };

export type DateMiseEnServiceEvent = ProjectEvent & {
  type: 'DateMiseEnService';
  payload: DateMiseEnServicePayload;
};
