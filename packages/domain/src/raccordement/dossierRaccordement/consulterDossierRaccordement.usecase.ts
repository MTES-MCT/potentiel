import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { DossierRaccordementReadModel } from './consulter/dossierRaccordement.readModel';
import { IdentifiantProjet } from '../../projet/identifiantProjet';

export const CONSULTER_DOSSIER_RACCORDEMENT_USECASE = Symbol(
  'CONSULTER_DOSSIER_RACCORDEMENT_USECASE',
);

export type ConsulterDossierRaccordementUseCase = Message<
  typeof CONSULTER_DOSSIER_RACCORDEMENT_USECASE,
  {
    identifiantProjet: IdentifiantProjet;
    référence: string;
  },
  DossierRaccordementReadModel
>;

export const registerConsulterDossierRaccordementUseCase = () => {
  const runner: MessageHandler<ConsulterDossierRaccordementUseCase> = async ({
    identifiantProjet,
    référence,
  }) => {
    return await mediator.send(
      buildConsulterDossierRaccordementUseCase({
        identifiantProjet,
        référence,
      }),
    );
  };

  mediator.register(CONSULTER_DOSSIER_RACCORDEMENT_USECASE, runner);
};

export const buildConsulterDossierRaccordementUseCase =
  getMessageBuilder<ConsulterDossierRaccordementUseCase>(CONSULTER_DOSSIER_RACCORDEMENT_USECASE);
