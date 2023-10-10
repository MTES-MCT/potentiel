import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone, isSome } from '@potentiel/monads';
import { IdentifiantGestionnaireRéseauValueType } from '../../gestionnaireRéseau/gestionnaireRéseau.valueType';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import { loadGestionnaireRéseauAggregateFactory } from '../../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import {
  DateDansLeFuturError,
  FormatRéférenceDossierRaccordementInvalideError,
  PlusieursGestionnairesRéseauPourUnProjetError,
  RéférenceDossierRaccordementDéjàExistantPourLeProjetError,
} from '../raccordement.errors';
import { GestionnaireRéseauInconnuError } from '../../gestionnaireRéseau/gestionnaireRéseau.error';
import { DemandeComplèteRaccordementTransmiseEventV1 } from '../raccordement.event';
import { RéférenceDossierRaccordementValueType } from '../raccordement.valueType';
import { DateTimeValueType } from '../../common.valueType';

export type TransmettreDemandeComplèteRaccordementCommand = Message<
  'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseauValueType;
    identifiantProjet: IdentifiantProjetValueType;
    dateQualification: DateTimeValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordementValueType;
  }
>;

export type TransmettreDemandeComplèteRaccordementDependencies = {
  loadAggregate: LoadAggregate;
  publish: Publish;
};

export const registerTransmettreDemandeComplèteRaccordementCommand = ({
  publish,
  loadAggregate,
}: TransmettreDemandeComplèteRaccordementDependencies) => {
  const loadGestionnaireRéseau = loadGestionnaireRéseauAggregateFactory({ loadAggregate });
  const loadRaccordement = loadRaccordementAggregateFactory({ loadAggregate });

  const handler: MessageHandler<TransmettreDemandeComplèteRaccordementCommand> = async ({
    identifiantProjet,
    dateQualification,
    identifiantGestionnaireRéseau,
    référenceDossierRaccordement,
  }) => {
    if (dateQualification.estDansLeFutur()) {
      throw new DateDansLeFuturError();
    }

    const gestionnaireRéseau = await loadGestionnaireRéseau(identifiantGestionnaireRéseau);

    if (isNone(gestionnaireRéseau)) {
      throw new GestionnaireRéseauInconnuError();
    }

    if (!gestionnaireRéseau.validerRéférenceDossierRaccordement(référenceDossierRaccordement)) {
      throw new FormatRéférenceDossierRaccordementInvalideError();
    }

    const raccordement = await loadRaccordement(identifiantProjet);

    if (isSome(raccordement)) {
      const gestionnaireRéseauActuel = await raccordement.getGestionnaireRéseau();

      if (
        isSome(gestionnaireRéseauActuel) &&
        !gestionnaireRéseauActuel.estÉgaleÀ(gestionnaireRéseau)
      ) {
        throw new PlusieursGestionnairesRéseauPourUnProjetError();
      }

      if (raccordement.contientLeDossier(référenceDossierRaccordement)) {
        throw new RéférenceDossierRaccordementDéjàExistantPourLeProjetError();
      }
    }

    const demandeComplèteRaccordementTransmise: DemandeComplèteRaccordementTransmiseEventV1 = {
      type: 'DemandeComplèteDeRaccordementTransmise-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        dateQualification: dateQualification.formatter(),
        identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
        référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
      },
    };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      demandeComplèteRaccordementTransmise,
    );
  };

  mediator.register('TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND', handler);
};
