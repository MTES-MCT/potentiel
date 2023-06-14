import { Readable } from 'stream';

type EnregistrerAccuséRéceptionDemandeComplèteRaccordementOptions =
  | {
      opération: 'création';
      type: 'demande-complete-raccordement';
      identifiantProjet: string;
      référenceDossierRaccordement: string;
      accuséRéception: { format: string; content: Readable };
    }
  | {
      opération: 'modification';
      type: 'demande-complete-raccordement';
      identifiantProjet: string;
      référenceDossierRaccordement: string;
      accuséRéception: { format: string; content: Readable };
    }
  | {
      opération: 'déplacement';
      type: 'demande-complete-raccordement';
      identifiantProjet: string;
      référenceDossierRaccordementActuelle: string;
      nouvelleRéférenceDossierRaccordement: string;
    };

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort = (
  options: EnregistrerAccuséRéceptionDemandeComplèteRaccordementOptions,
) => Promise<void>;

type EnregistrerPropositionTechniqueEtFinancièreSignéeOptions =
  | {
      opération: 'création';
      type: 'proposition-technique-et-financiere';
      identifiantProjet: string;
      référenceDossierRaccordement: string;
      propositionTechniqueEtFinancièreSignée: { format: string; content: Readable };
    }
  | {
      opération: 'modification';
      type: 'proposition-technique-et-financiere';
      identifiantProjet: string;
      référenceDossierRaccordement: string;
      propositionTechniqueEtFinancièreSignée: { format: string; content: Readable };
    }
  | {
      opération: 'déplacement';
      type: 'proposition-technique-et-financiere';
      identifiantProjet: string;
      référenceDossierRaccordementActuelle: string;
      nouvelleRéférenceDossierRaccordement: string;
    };

export type EnregistrerPropositionTechniqueEtFinancièreSignéePort = (
  options: EnregistrerPropositionTechniqueEtFinancièreSignéeOptions,
) => Promise<void>;
