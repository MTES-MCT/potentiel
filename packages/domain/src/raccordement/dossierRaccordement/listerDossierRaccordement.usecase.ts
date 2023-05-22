import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { IdentifiantProjet } from '../../projet/identifiantProjet';
import { ListeDossiersRaccordementReadModel } from './lister/listeDossierRaccordement.readModel';

const LISTER_DOSSIER_RACCORDEMENT_USECASE = Symbol('LISTER_DOSSIER_RACCORDEMENT_USECASE');

export type ListerDossiersRaccordementUseCase = Message<
  typeof LISTER_DOSSIER_RACCORDEMENT_USECASE,
  {
    identifiantProjet: IdentifiantProjet;
  },
  ListeDossiersRaccordementReadModel
>;

export const registerListerDossiersRaccordementUseCase = () => {
  const runner: MessageHandler<ListerDossiersRaccordementUseCase> = async ({
    identifiantProjet,
  }) => {
    return await mediator.send(
      buildListerDossiersRaccordementUseCase({
        identifiantProjet,
      }),
    );
  };

  mediator.register(LISTER_DOSSIER_RACCORDEMENT_USECASE, runner);
};

export const buildListerDossiersRaccordementUseCase =
  getMessageBuilder<ListerDossiersRaccordementUseCase>(LISTER_DOSSIER_RACCORDEMENT_USECASE);
