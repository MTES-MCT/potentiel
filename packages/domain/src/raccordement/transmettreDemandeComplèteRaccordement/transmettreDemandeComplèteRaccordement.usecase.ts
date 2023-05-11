import { createReadStream } from 'fs';
import { CommandHandler, QueryHandler } from '@potentiel/core-domain';
// import { UploadFile } from '@potentiel/adapter-domain';
import { TransmettreDemandeComplèteRaccordementCommand } from './transmettreDemandeComplèteRaccordement.command';
import {
  ConsulterGestionnaireRéseauQuery,
  GestionnaireRéseauReadModel,
} from '../../gestionnaireRéseau';

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
  'accuséRéception'
> & {
  accuséRéception: {
    format: string;
    contenu: Express.Multer.File;
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
    accuséRéception: { format, contenu },
  }: TransmettreDemandeComplèteRaccordementUseCaseFactoryParams) => {
    const gestionnaireRéseau = await consulterGestionnaireRéseauQuery({
      codeEIC: identifiantGestionnaireRéseau.codeEIC,
    });

    const readableContenu = createReadStream(contenu.path);

    // appeler adapter
    // upload;

    await transmettreDemandeComplèteRaccordementCommand({
      identifiantProjet,
      identifiantGestionnaireRéseau: { codeEIC: gestionnaireRéseau.codeEIC },
      dateQualification,
      référenceDossierRaccordement,
      formatFichier: format,
    });
  };
