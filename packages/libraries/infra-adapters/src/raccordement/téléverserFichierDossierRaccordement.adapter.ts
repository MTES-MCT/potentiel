import { deleteFile, upload } from '@potentiel/file-storage';
import { join } from 'path';
import { extension } from 'mime-types';
import { Readable } from 'stream';
import {
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort,
  EnregistrerPropositionTechniqueEtFinancièreSignéePort,
} from '@potentiel/domain';

function compareReadableStreams(stream1: Readable, stream2: Readable): Promise<boolean> {
  return new Promise((resolve) => {
    let content1 = '';
    let content2 = '';

    stream1.on('data', (data: Readable) => {
      content1 += data.toString();
    });

    stream2.on('data', (data: Readable) => {
      content2 += data.toString();
    });

    stream1.on('end', () => {
      if (content1 === content2) {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    stream1.on('error', () => resolve(false));
    stream2.on('error', () => resolve(false));
  });
}

const téléverserFichierDossierRaccordementAdapter =
  (nomFichier: string): EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort =>
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
    }

    if (params.opération === 'modification') {
      const {
        identifiantProjet,
        ancienneRéférenceDossierRaccordement,
        nouvelleRéférenceDossierRaccordement,
        ancienFichier,
        nouveauFichier,
      } = params;

      const filetoDeletePath = join(
        identifiantProjet,
        ancienneRéférenceDossierRaccordement,
        `${nomFichier}.${extension(ancienFichier.format)}`,
      );

      const fileToAddPath = join(
        identifiantProjet,
        nouvelleRéférenceDossierRaccordement,
        `${nomFichier}.${extension(nouveauFichier.format)}`,
      );

      const fichiersIdentiques = await compareReadableStreams(
        Readable.from(ancienFichier.content),
        Readable.from(nouveauFichier.content),
      );

      const pathsIdentiques = filetoDeletePath === fileToAddPath;

      if (fichiersIdentiques && pathsIdentiques) {
        return;
      }

      await deleteFile(filetoDeletePath);
      await upload(fileToAddPath, nouveauFichier.content);
    }
  };

export const téléverserAccuséRéceptionDemandeComplèteRaccordementAdapter: EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort =
  téléverserFichierDossierRaccordementAdapter('demande-complete-raccordement');
export const téléverserPropositionTechniqueEtFinancièreSignéeAdapter: EnregistrerPropositionTechniqueEtFinancièreSignéePort =
  téléverserFichierDossierRaccordementAdapter('proposition-technique-et-financiere');
