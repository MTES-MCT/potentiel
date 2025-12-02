import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type AbandonEntity = Entity<
  'abandon',
  {
    // @TODO : mettre des conditions ?
    identifiantProjet: string;
    demandéLe: DateTime.RawType;
    accordéLe?: DateTime.RawType;
    estAbandonné: boolean;
    demandeEnCours: boolean;

    // @TODO : à garder recandidature ?
    estUneRecandidature: boolean;
    recandidature?: {
      statut: string;
      preuve?: {
        demandéeLe: DateTime.RawType;
        identifiantProjet?: string;
        transmiseLe?: DateTime.RawType;
        transmisePar?: string;
      };
    };
  }
>;
