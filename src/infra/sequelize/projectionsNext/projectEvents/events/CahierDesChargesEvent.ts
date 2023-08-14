import { DateParutionCahierDesChargesModifié } from '../../../../../entities/cahierDesCharges';
import { ProjectEvent } from '../projectEvent.model';

export type CahierDesChargesEvent = ProjectEvent & {
  type: 'CahierDesChargesChoisi';
  payload: {
    choisiPar: string;
  } & (
    | {
        type: 'initial';
      }
    | {
        type: 'modifié';
        paruLe: DateParutionCahierDesChargesModifié;
        alternatif?: true;
      }
  );
};
