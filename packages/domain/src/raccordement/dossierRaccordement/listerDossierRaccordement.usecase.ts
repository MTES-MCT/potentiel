import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { IdentifiantProjet } from '../../projet/valueType/identifiantProjet';
import { ListeDossiersRaccordementReadModel } from './lister/listeDossierRaccordement.readModel';
import { buildListerDossiersRaccordementQuery } from './lister/listerDossierRaccordement.query';

export type ListerDossiersRaccordementUseCase = Message<
  'LISTER_DOSSIER_RACCORDEMENT_USECASE',
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
      buildListerDossiersRaccordementQuery({
        identifiantProjet,
      }),
    );
  };

  mediator.register('LISTER_DOSSIER_RACCORDEMENT_USECASE', runner);
};

export const buildListerDossiersRaccordementUseCase =
  getMessageBuilder<ListerDossiersRaccordementUseCase>('LISTER_DOSSIER_RACCORDEMENT_USECASE');
