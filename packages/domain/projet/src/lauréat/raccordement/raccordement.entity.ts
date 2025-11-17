import { DateTime, Email } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

type DossierRaccordement = {
  identifiantGestionnaireRéseau: string;
  identifiantProjet: string;

  référence: string;
  demandeComplèteRaccordement?: {
    dateQualification?: DateTime.RawType;
    accuséRéception?: { format: string };
    transmiseLe?: DateTime.RawType;
    transmisePar?: Email.RawType;
  };
  propositionTechniqueEtFinancière?: {
    dateSignature: string;
    propositionTechniqueEtFinancièreSignée?: {
      format: string;
    };
  };
  miseEnService?: {
    dateMiseEnService: DateTime.RawType;
    transmiseLe: DateTime.RawType;
    transmisePar?: Email.RawType;
  };
  miseÀJourLe: DateTime.RawType;
};

export type RaccordementEntity = Entity<
  'raccordement',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
  }
>;

export type DossierRaccordementEntity = Entity<'dossier-raccordement', DossierRaccordement>;
