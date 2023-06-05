import { mediator, MessageHandler, Message, getMessageBuilder } from 'mediateur';
import { AccuséRéceptionDemandeComplèteRaccordementReadModel } from './consulterAccuséRéception/accuséRéceptionDemandeComplèteRaccordement.readModel';
import { buildConsulterAccuséRéceptionDemandeComplèteRaccordementQuery } from './consulterAccuséRéception/consulterAccuséRéceptionDemandeComplèteRaccordement.query';
import { buildConsulterDossierRaccordementQuery } from '../dossierRaccordement/consulter/consulterDossierRaccordement.query';
import { DossierRaccordementReadModel } from '../dossierRaccordement/consulter/dossierRaccordement.readModel';
import { IdentifiantProjet } from '../../projet/projet.valueType';

import { FichierInexistant } from '@potentiel/file-storage';

type ConsulterDemandeComplèteRaccordementUseCaseResult = Omit<
  AccuséRéceptionDemandeComplèteRaccordementReadModel &
    Pick<DossierRaccordementReadModel, 'dateQualification'> & {
      référenceDossierRaccordement: DossierRaccordementReadModel['référence'];
    },
  'type'
>;

type ConsulterDemandeComplèteRaccordementUseCase = Message<
  'CONSULTER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: string;
  },
  ConsulterDemandeComplèteRaccordementUseCaseResult
>;

export const registerConsulterDemandeComplèteRaccordementUseCase = () => {
  const runner: MessageHandler<ConsulterDemandeComplèteRaccordementUseCase> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
  }) => {
    const dossierRaccordement = await mediator.send(
      buildConsulterDossierRaccordementQuery({
        identifiantProjet,
        référence: référenceDossierRaccordement,
      }),
    );

    const accuséRéception = await mediator.send(
      buildConsulterAccuséRéceptionDemandeComplèteRaccordementQuery({
        identifiantProjet,
        référenceDossierRaccordement,
        format: dossierRaccordement.accuséRéception?.format || '',
      }),
    );

    if (!accuséRéception) {
      throw new FichierInexistant();
    }

    return {
      ...accuséRéception,
      dateQualification: dossierRaccordement.dateQualification,
      référenceDossierRaccordement,
    } satisfies ConsulterDemandeComplèteRaccordementUseCaseResult;
  };

  mediator.register('CONSULTER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE', runner);
};

export const buildConsulterDemandeComplèteRaccordementUseCase =
  getMessageBuilder<ConsulterDemandeComplèteRaccordementUseCase>(
    'CONSULTER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
  );
