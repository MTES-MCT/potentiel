import { mediator, MessageHandler, Message, getMessageBuilder } from 'mediateur';
import { AccuséRéceptionDemandeComplèteRaccordementReadModel } from './consulterAccuséRéception/accuséRéceptionDemandeComplèteRaccordement.readModel';
import { buildConsulterAccuséRéceptionDemandeComplèteRaccordementQuery } from './consulterAccuséRéception/consulterAccuséRéceptionDemandeComplèteRaccordement.query';
import { buildConsulterDossierRaccordementQuery } from '../dossierRaccordement/consulter/consulterDossierRaccordement.query';
import { DossierRaccordementReadModel } from '../dossierRaccordement/consulter/dossierRaccordement.readModel';
import { IdentifiantProjet } from '../../projet/identifiantProjet';

const CONSULTER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE = Symbol(
  'CONSULTER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
);

type ConsulterDemandeComplèteRaccordementUseCaseResult = Omit<
  AccuséRéceptionDemandeComplèteRaccordementReadModel &
    Pick<DossierRaccordementReadModel, 'dateQualification' | 'référence'>,
  'type'
>;

type ConsulterDemandeComplèteRaccordementUseCase = Message<
  typeof CONSULTER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE,
  {
    identifiantProjet: IdentifiantProjet;
    référence: string;
  },
  ConsulterDemandeComplèteRaccordementUseCaseResult
>;

export const registerConsulterDemandeComplèteRaccordementUseCase = () => {
  const runner: MessageHandler<ConsulterDemandeComplèteRaccordementUseCase> = async ({
    identifiantProjet,
    référence,
  }) => {
    const dossierRaccordement = await mediator.send(
      buildConsulterDossierRaccordementQuery({
        identifiantProjet,
        référence,
      }),
    );

    const accuséRéception = await mediator.send(
      buildConsulterAccuséRéceptionDemandeComplèteRaccordementQuery({
        identifiantProjet,
        référence,
        format: dossierRaccordement.accuséRéception?.format || '',
      }),
    );

    return {
      ...accuséRéception,
      dateQualification: dossierRaccordement.dateQualification,
      référence,
    };
  };

  mediator.register(CONSULTER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE, runner);
};

export const buildConsulterDemandeComplèteRaccordementUseCase =
  getMessageBuilder<ConsulterDemandeComplèteRaccordementUseCase>(
    CONSULTER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE,
  );
