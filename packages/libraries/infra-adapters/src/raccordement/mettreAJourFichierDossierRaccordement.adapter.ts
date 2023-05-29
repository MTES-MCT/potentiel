import { MettreAJourAccuséRéceptionDemandeComplèteRaccordementPort } from '@potentiel/domain';
import { convertReadableToString, updateFile } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

const mettreAJourFichierDossierRaccordementAdapter =
  (nomFichier: string): MettreAJourAccuséRéceptionDemandeComplèteRaccordementPort =>
  async ({ identifiantProjet, référenceDossierRaccordement, format, content }) => {
    const filePath = join(
      identifiantProjet,
      référenceDossierRaccordement,
      `${nomFichier}.${extension(format)}`,
    );
    try {
      const stringContent = await convertReadableToString(content);
      await updateFile(filePath, stringContent);
    } catch (error) {
      console.error('Impossible de lire contenu du fichier', error);
    }
  };

export const mettreAJourAccuséRéceptionDemandeComplèteRaccordementAdapter: MettreAJourAccuséRéceptionDemandeComplèteRaccordementPort =
  mettreAJourFichierDossierRaccordementAdapter('demande-complete-raccordement');
