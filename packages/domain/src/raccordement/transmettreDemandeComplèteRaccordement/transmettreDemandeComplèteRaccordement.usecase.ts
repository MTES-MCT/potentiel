import { CommandHandler, QueryHandler } from '@potentiel/core-domain';
import { UploadFile, uploadFile } from '@potentiel/adapter-domain';
import { TransmettreDemandeComplèteRaccordementCommand } from './transmettreDemandeComplèteRaccordement.command';
import {
  ConsulterGestionnaireRéseauQuery,
  GestionnaireRéseauReadModel,
} from '../../gestionnaireRéseau';
import { upload } from '@potentiel/file-storage';

type Dependencies = {
  transmettreDemandeComplèteRaccordementCommand: CommandHandler<TransmettreDemandeComplèteRaccordementCommand>;
  consulterGestionnaireRéseauQuery: QueryHandler<
    ConsulterGestionnaireRéseauQuery,
    GestionnaireRéseauReadModel
  >;
  uploadFile: UploadFile;
};

type TransmettreDemandeComplèteRaccordementUseCaseFactoryParams = Omit<
  TransmettreDemandeComplèteRaccordementCommand,
  'formatFichier'
> & {
  accuséRéception: {
    format: Express.Multer.File['mimetype'];
    path: Express.Multer.File['path'];
  };
};

export const transmettreDemandeComplèteRaccordementUseCaseFactory =
  ({
    transmettreDemandeComplèteRaccordementCommand,
    consulterGestionnaireRéseauQuery,
  }: Dependencies) =>
  async ({
    dateQualification,
    identifiantGestionnaireRéseau,
    identifiantProjet,
    référenceDossierRaccordement,
    accuséRéception: { format, path },
  }: TransmettreDemandeComplèteRaccordementUseCaseFactoryParams) => {
    const gestionnaireRéseau = await consulterGestionnaireRéseauQuery({
      codeEIC: identifiantGestionnaireRéseau.codeEIC,
    });

    const uploadFichier = uploadFile(upload);
    await uploadFichier(path);

    await transmettreDemandeComplèteRaccordementCommand({
      identifiantProjet,
      identifiantGestionnaireRéseau: { codeEIC: gestionnaireRéseau.codeEIC },
      dateQualification,
      référenceDossierRaccordement,
      formatFichier: format,
    });
  };
