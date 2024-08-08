import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/core';

export type CandidatureEntity = Entity<
  'candidature',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    statut: StatutProjet.RawType;
    nom: string;
  }
>;
