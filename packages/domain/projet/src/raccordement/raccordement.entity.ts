import { DateTime, Email } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

type DossierRaccordement = {
  identifiantGestionnaireRéseau: string;
  identifiantProjet: string;

  référence: string;
  projetNotifiéLe?: DateTime.RawType;
  demandeComplèteRaccordement?: {
    dateQualification?: DateTime.RawType;
    accuséRéception?: { format: string };
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
    tranmisePar?: Email.RawType;
  };
  misÀJourLe: DateTime.RawType;
};

export type RaccordementEntity = Entity<
  'raccordement',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
    dossiers: Array<DossierRaccordement>;
  }
>;

export type DossierRaccordementEntity = Entity<'dossier-raccordement', DossierRaccordement>;
