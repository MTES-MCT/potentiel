import { Entity } from '@potentiel-domain/entity';

type DossierRaccordement = {
  identifiantGestionnaireRéseau: string;
  identifiantProjet: string;
  appelOffre: string;

  référence: string;
  demandeComplèteRaccordement?: {
    dateQualification?: string;
    accuséRéception?: { format: string };
  };
  propositionTechniqueEtFinancière?: {
    dateSignature: string;
    propositionTechniqueEtFinancièreSignée?: {
      format: string;
    };
  };
  miseEnService?: {
    dateMiseEnService: string;
  };
  misÀJourLe: string;
};

export type RaccordementEntity = Entity<
  'raccordement',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
    nomProjet: string;

    appelOffre: string;
    période: string;
    famille?: string;
    numéroCRE: string;

    dossiers: Array<DossierRaccordement>;
  }
>;

export type DossierRaccordementEntity = Entity<'dossier-raccordement', DossierRaccordement>;
