import { renameFile, upload } from '@potentiel/file-storage';
import { join } from 'path';
import { extension } from 'mime-types';
import {
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort,
  EnregistrerPropositionTechniqueEtFinancièreSignéePort,
  ModifierAccuséRéceptionDemandeComplèteRaccordementPort,
  ModifierPropositionTechniqueEtFinancièreSignéePort,
} from '@potentiel/domain';

type TéléverserFichierDossierRaccordementAdapter =
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort &
    EnregistrerPropositionTechniqueEtFinancièreSignéePort &
    ModifierAccuséRéceptionDemandeComplèteRaccordementPort &
    ModifierPropositionTechniqueEtFinancièreSignéePort;

const téléverserFichierDossierRaccordementAdapter =
  (nomFichier: string): TéléverserFichierDossierRaccordementAdapter =>
  async (params) => {
    if (params.opération === 'création') {
      const {
        identifiantProjet,
        référenceDossierRaccordement,
        nouveauFichier: { content, format },
      } = params;

      const path = join(
        identifiantProjet,
        référenceDossierRaccordement,
        `${nomFichier}.${extension(format)}`,
      );
      await upload(path, content);
      return;
    }

    const oldPath = join(
      params.identifiantProjet,
      params.ancienneRéférenceDossierRaccordement,
      `${nomFichier}.${extension(params.ancienFichier.format)}`,
    );

    if (params.opération === 'modification') {
      await upload(oldPath, params.nouveauFichier.content);
    }

    if (params.opération === 'déplacement-fichier') {
      const newPath = join(
        params.identifiantProjet,
        params.nouvelleRéférenceDossierRaccordement,
        `${nomFichier}.${extension(params.nouveauFichier.format)}`,
      );
      await upload(oldPath, params.nouveauFichier.content);
      await renameFile(oldPath, newPath);
    }
  };

export const téléverserAccuséRéceptionDemandeComplèteRaccordementAdapter: EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort &
  ModifierAccuséRéceptionDemandeComplèteRaccordementPort =
  téléverserFichierDossierRaccordementAdapter('demande-complete-raccordement');
export const téléverserPropositionTechniqueEtFinancièreSignéeAdapter: EnregistrerPropositionTechniqueEtFinancièreSignéePort &
  ModifierPropositionTechniqueEtFinancièreSignéePort = téléverserFichierDossierRaccordementAdapter(
  'proposition-technique-et-financiere',
);
