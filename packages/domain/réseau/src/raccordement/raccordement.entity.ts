import { Projection } from '@potentiel-libraries/projection';

export type RaccordementEntity = Projection<
  'raccordement',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
    nomProjet: string;

    appelOffre: string;
    période: string;
    famille?: string;
    numéroCRE: string;

    demandes: Array<{
      référence: string;
      demandeComplèteRaccordement?: {
        dateQualification?: string;
        accuséRéception?: { format: string };
      };
      propositionTechniqueEtFinancière?: {
        dateSignature: string;
        format: string;
      };
      miseEnService?: {
        dateMiseEnService: string;
      };
    }>;
  }
>;

export type DossierRaccordementEntity = Projection<
  'dossier-raccordement',
  {
    référence: string;
    demandeComplèteRaccordement: {
      dateQualification?: string;
      accuséRéception?: { format: string };
    };
    propositionTechniqueEtFinancière?: {
      dateSignature: string;
      format: string;
    };
    miseEnService?: {
      dateMiseEnService: string;
    };
  }
>;

export type RéférenceRaccordementIdentifiantProjetEntity = Projection<
  'référence-raccordement-projet',
  {
    identifiantProjet: string;
    référence: string;
  }
>;
