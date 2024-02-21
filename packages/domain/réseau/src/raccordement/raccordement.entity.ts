import { Projection } from '@potentiel-domain/entity';

type DossierRaccordement = {
  référence: string;
  demandeComplèteRaccordement: {
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

    dossiers: Array<DossierRaccordement>;
  }
>;

export type DossierRaccordementEntity = Projection<'dossier-raccordement', DossierRaccordement>;

export type RéférenceRaccordementIdentifiantProjetEntity = Projection<
  'référence-raccordement-projet',
  {
    identifiantProjet: string;
    référence: string;
  }
>;
