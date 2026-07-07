import type { DateTime, Email } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

type DocumentRaccordement = {
  dateSignature: string;
  document: {
    format: string;
  };
};

export type DossierRaccordement = {
  identifiantGestionnaireRéseau: string;
  identifiantProjet: string;

  référence: string;
  demandeComplèteRaccordement?: {
    dateQualification?: DateTime.RawType;
    accuséRéception?: { format: string };
    transmiseLe?: DateTime.RawType;
    transmisePar?: Email.RawType;
  };
  propositionTechniqueEtFinancière?: DocumentRaccordement;
  conventionDeRaccordement?: DocumentRaccordement;
  conventionDirecteDeRaccordement?: DocumentRaccordement;
  miseEnService?: {
    dateMiseEnService: DateTime.RawType;
    transmiseLe: DateTime.RawType;
    transmisePar?: Email.RawType;
  };
  miseÀJourLe: DateTime.RawType;
};

export type DossierRaccordementEntity = Entity<'dossier-raccordement', DossierRaccordement>;
