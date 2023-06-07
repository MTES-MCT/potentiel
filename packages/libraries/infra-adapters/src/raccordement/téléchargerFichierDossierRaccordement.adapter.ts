import {
  RécupérerAccuséRéceptionDemandeComplèteRaccordementPort,
  RécupérerPropositionTechniqueEtFinancièreSignéePort,
} from '@potentiel/domain-views';
import { download } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

type TéléchargerFichierDossierRaccordementAdapter =
  RécupérerAccuséRéceptionDemandeComplèteRaccordementPort &
    RécupérerPropositionTechniqueEtFinancièreSignéePort;

export const téléchargerFichierDossierRaccordementAdapter: TéléchargerFichierDossierRaccordementAdapter &
  RécupérerPropositionTechniqueEtFinancièreSignéePort = async ({
  identifiantProjet,
  référenceDossierRaccordement,
  format,
  type,
}) => {
  const filePath = join(
    identifiantProjet,
    référenceDossierRaccordement,
    `${type}.${extension(format)}`,
  );

  try {
    return await download(filePath);
  } catch (error) {
    return undefined;
  }
};
