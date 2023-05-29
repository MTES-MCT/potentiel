import { RenommerAccuséRéceptionDemandeComplèteRaccordementPort } from '@potentiel/domain';
import { renameFile } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

const renommerFichierDossierRaccordementAdapter =
  (nomFichier: string): RenommerAccuséRéceptionDemandeComplèteRaccordementPort =>
  async ({
    format,
    identifiantProjet,
    ancienneRéférenceDossierRaccordement,
    nouvelleRéférenceDossierRaccordement,
  }) => {
    const oldFilePath = join(
      identifiantProjet,
      ancienneRéférenceDossierRaccordement,
      `${nomFichier}.${extension(format)}`,
    );
    const newFilePath = join(
      identifiantProjet,
      nouvelleRéférenceDossierRaccordement,
      `${nomFichier}.${extension(format)}`,
    );
    await renameFile(oldFilePath, newFilePath);
  };

export const renommerAccuséRéceptionDemandeComplèteRaccordementAdapter: RenommerAccuséRéceptionDemandeComplèteRaccordementPort =
  renommerFichierDossierRaccordementAdapter('demande-complete-raccordement');
