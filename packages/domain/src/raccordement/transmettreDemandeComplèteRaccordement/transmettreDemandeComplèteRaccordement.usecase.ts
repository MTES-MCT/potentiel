import {
  createConsulterGestionnaireRéseauQuery,
} from '../../gestionnaireRéseau';
import { EnregistrerAccuséRéceptionDemandeComplèteRaccordement } from './enregistrerAccuséRéceptionDemandeComplèteRaccordement';
import { Readable } from 'stream';

type Dependencies = {
  transmettreDemandeComplèteRaccordementCommand: CommandHandler<TransmettreDemandeComplèteRaccordementCommand>;
  consulterGestionnaireRéseauQuery: QueryHandler<
    ConsulterGestionnaireRéseauQuery,
    GestionnaireRéseauReadModel
  >;
  enregistrerAccuséRéceptionDemandeComplèteRaccordement: EnregistrerAccuséRéceptionDemandeComplèteRaccordement;
};

type TransmettreDemandeComplèteRaccordementUseCaseFactoryParams = Omit<
  TransmettreDemandeComplèteRaccordementCommand,
  'formatFichier'
> & {
  accuséRéception: {
    format: string;
    content: Readable;
  };
};

export const transmettreDemandeComplèteRaccordementUseCaseFactory =
  ({
    transmettreDemandeComplèteRaccordementCommand,
    consulterGestionnaireRéseauQuery,
    enregistrerAccuséRéceptionDemandeComplèteRaccordement,
  }: Dependencies) =>
  TransmettreDemandeComplèteRaccordementCommand,
  createTransmettreDemandeComplèteRaccordementCommand,
} from './transmettreDemandeComplèteRaccordement.command';
import { createConsulterGestionnaireRéseauQuery } from '../../gestionnaireRéseau';
import { mediator } from 'mediateur';

export const transmettreDemandeComplèteRaccordementUseCase = async ({
  dateQualification,
  identifiantGestionnaireRéseau,
  identifiantProjet,
  référenceDossierRaccordement,
}: TransmettreDemandeComplèteRaccordementCommand['data']) => {
  const gestionnaireRéseau = await mediator.send(
    createConsulterGestionnaireRéseauQuery({
      codeEIC: identifiantGestionnaireRéseau.codeEIC,
    }),
  );

<<<<<<< HEAD
export const transmettreDemandeComplèteRaccordementUseCaseFactory =
  ({ transmettreDemandeComplèteRaccordementCommand }: Dependencies) =>
  async ({
    dateQualification,
    identifiantGestionnaireRéseau,
    identifiantProjet,
    référenceDossierRaccordement,
<<<<<<< HEAD
    accuséRéception: { format, content },
  }: TransmettreDemandeComplèteRaccordementUseCaseFactoryParams) => {
    const gestionnaireRéseau = await consulterGestionnaireRéseauQuery({
      codeEIC: identifiantGestionnaireRéseau.codeEIC,
    });
=======
  }: TransmettreDemandeComplèteRaccordementCommand) => {
    const gestionnaireRéseau = await mediator.send(
      createConsulterGestionnaireRéseauQuery({
        codeEIC: identifiantGestionnaireRéseau.codeEIC,
      }),
    );
>>>>>>> a5f84974 (♻️ Refacto consulter gestionnaire reseau)

    await transmettreDemandeComplèteRaccordementCommand({
=======
  await mediator.send(
    createTransmettreDemandeComplèteRaccordementCommand({
>>>>>>> 16d23fe4 (♻️ Refacto transmettre DCR command)
      identifiantProjet,
      identifiantGestionnaireRéseau: { codeEIC: gestionnaireRéseau.codeEIC },
      dateQualification,
      référenceDossierRaccordement,
<<<<<<< HEAD
      accuséRéception: { format },
    });

    await enregistrerAccuséRéceptionDemandeComplèteRaccordement({
      identifiantProjet,
      référenceDossierRaccordement,
      format,
      content,
    });
  };
=======
    }),
  );
};
>>>>>>> 16d23fe4 (♻️ Refacto transmettre DCR command)
