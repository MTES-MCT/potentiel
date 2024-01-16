import { Projection } from '@potentiel-libraries/projection';

export type RaccordementEntity = Projection<
  'raccordemement',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
    nomProjet: string;

    appelOffre: string;
    période: string;
    famille?: string;
    numéroCRE: string;

    demandes: {
      [référence: string]: {
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
      };
    };
  }
>;

export type DemandeRaccordementEntity = Projection<
  'demande-raccordement',
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
  'référence-raccordement-identifiant-projet',
  {
    identifiantProjet: string;
    référence: string;
  }
>;
