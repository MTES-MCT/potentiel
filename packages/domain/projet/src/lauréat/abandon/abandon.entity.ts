import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type AbandonEntity = Entity<
  'abandon',
  {
    identifiantProjet: string;
    demandéLe: DateTime.RawType;
    accordéLe?: DateTime.RawType;
    estAbandonné: boolean;
    demandeEnCours: boolean;
  }
>;
