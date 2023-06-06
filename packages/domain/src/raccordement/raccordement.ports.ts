import { Readable } from 'stream';

type EnregistrerAccuséRéceptionDemandeComplèteRaccordementOptions =
  | {
      type: 'création';
      identifiantProjet: string;
      référenceDossierRaccordement: string;
      accuséRéception: { format: string; content: Readable };
    }
  | {
      type: 'modification';
      identifiantProjet: string;
      référenceDossierRaccordement: string;
      accuséRéception: { format: string; content: Readable };
    }
  | {
      type: 'déplacement';
      identifiantProjet: string;
      ancienneRéférenceDossierRaccordement: string;
      nouvelleRéférenceDossierRaccordement: string;
    };

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort = (
  options: EnregistrerAccuséRéceptionDemandeComplèteRaccordementOptions,
) => Promise<void>;

type EnregistrerPropositionTechniqueEtFinancièreSignéeOptions =
  | {
      type: 'création';
      identifiantProjet: string;
      référenceDossierRaccordement: string;
      propositionTechniqueEtFinancièreSignée: { format: string; content: Readable };
    }
  | {
      type: 'modification';
      identifiantProjet: string;
      référenceDossierRaccordement: string;
      propositionTechniqueEtFinancièreSignée: { format: string; content: Readable };
    }
  | {
      type: 'déplacement';
      identifiantProjet: string;
      ancienneRéférenceDossierRaccordement: string;
      nouvelleRéférenceDossierRaccordement: string;
    };

export type EnregistrerPropositionTechniqueEtFinancièreSignéePort = (
  options: EnregistrerPropositionTechniqueEtFinancièreSignéeOptions,
) => Promise<void>;
