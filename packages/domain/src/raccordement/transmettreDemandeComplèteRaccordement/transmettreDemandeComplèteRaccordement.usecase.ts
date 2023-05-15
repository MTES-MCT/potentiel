import { newConsulterGestionnaireRéseauQuery } from '../../gestionnaireRéseau';
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
  newTransmettreDemandeComplèteRaccordementCommand,
} from './transmettreDemandeComplèteRaccordement.command';
import { Message, MessageHandler, mediator, newMessage } from 'mediateur';

const TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE = Symbol(
  'MODIFIER_GESTIONNAIRE_RESEAU_PROJET_USE_CASE',
);

export const transmettreDemandeComplèteRaccordementUseCaseFactory =
  ({ transmettreDemandeComplèteRaccordementCommand }: Dependencies) =>
  async ({
type TransmettreDemandeComplèteRaccordementUseCaseData =
  TransmettreDemandeComplèteRaccordementCommand['data'];

type TransmettreDemandeComplèteRaccordementUseCase = Message<
  typeof TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE,
  TransmettreDemandeComplèteRaccordementUseCaseData
>;

export const registerTransmettreDemandeComplèteRaccordementUseCase = () => {
  const runner: MessageHandler<TransmettreDemandeComplèteRaccordementUseCase> = async ({
    dateQualification,
    identifiantGestionnaireRéseau,
    identifiantProjet,
    référenceDossierRaccordement,
    accuséRéception: { format, content },
  }: TransmettreDemandeComplèteRaccordementUseCaseFactoryParams) => {
    const gestionnaireRéseau = await consulterGestionnaireRéseauQuery({
      codeEIC: identifiantGestionnaireRéseau.codeEIC,
    });
  }: TransmettreDemandeComplèteRaccordementCommand) => {
    const gestionnaireRéseau = await mediator.send(
      createConsulterGestionnaireRéseauQuery({
        codeEIC: identifiantGestionnaireRéseau.codeEIC,
      }),
    );

    await transmettreDemandeComplèteRaccordementCommand({
  await mediator.send(
    createTransmettreDemandeComplèteRaccordementCommand({
    newTransmettreDemandeComplèteRaccordementCommand({
      identifiantProjet,
      identifiantGestionnaireRéseau: { codeEIC: gestionnaireRéseau.codeEIC },
      dateQualification,
      référenceDossierRaccordement,
      accuséRéception: { format },
    });

    await enregistrerAccuséRéceptionDemandeComplèteRaccordement({
      identifiantProjet,
      référenceDossierRaccordement,
      format,
      content,
    });
  };
    }),
  );
};
  }: TransmettreDemandeComplèteRaccordementCommand['data']) => {
    const gestionnaireRéseau = await mediator.send(
      newConsulterGestionnaireRéseauQuery({
        codeEIC: identifiantGestionnaireRéseau.codeEIC,
      }),
    );

    await mediator.send(
      newTransmettreDemandeComplèteRaccordementCommand({
        identifiantProjet,
        identifiantGestionnaireRéseau: { codeEIC: gestionnaireRéseau.codeEIC },
        dateQualification,
        référenceDossierRaccordement,
      }),
    );
  };
  mediator.register(TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE, runner);
};

export const newTransmettreDemandeComplèteRaccordementUseCase = newMessage(
  TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE,
);
