import { Message, MessageHandler, getMessageBuilder, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { DemandeComplèteRaccordementTransmiseEvent } from './demandeComplèteRaccordementTransmise.event';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../../raccordement.aggregate';
import {
  FormatRéférenceDossierRaccordementInvalideError,
  PlusieursGestionnairesRéseauPourUnProjetError,
  RéférenceDossierRaccordementDéjàExistantPourLeProjetError,
} from '../../raccordement.errors';
import { isNone, isSome } from '@potentiel/monads';
import { loadGestionnaireRéseauAggregateFactory } from '../../../gestionnaireRéseau/aggregate/gestionnaireRéseau.aggregate';
import { GestionnaireNonRéférencéError } from '../../../gestionnaireRéseau/query/consulter/gestionnaireNonRéférencé.error';
import {
  IdentifiantGestionnaireRéseau,
  formatIdentifiantGestionnaireRéseau,
} from '../../../gestionnaireRéseau/valueType/identifiantGestionnaireRéseau';
import {
  IdentifiantProjet,
  formatIdentifiantProjet,
} from '../../../projet/valueType/identifiantProjet';

export type TransmettreDemandeComplèteRaccordementCommand = Message<
  'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau;
    identifiantProjet: IdentifiantProjet;
    dateQualification?: Date;
    référenceDossierRaccordement: string;
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
    const gestionnaireRéseau = await loadGestionnaireRéseau(identifiantGestionnaireRéseau.codeEIC);
    const raccordement = await loadRaccordement(identifiantProjet);

    if (isNone(gestionnaireRéseau)) {
      throw new GestionnaireNonRéférencéError(identifiantGestionnaireRéseau.codeEIC);
    }

    if (
      isSome(raccordement) &&
      raccordement.gestionnaireRéseau.codeEIC !== identifiantGestionnaireRéseau.codeEIC
    ) {
      throw new PlusieursGestionnairesRéseauPourUnProjetError();
    }

    if (isSome(raccordement) && raccordement.références.includes(référenceDossierRaccordement)) {
      throw new RéférenceDossierRaccordementDéjàExistantPourLeProjetError();
    }

    const { aideSaisieRéférenceDossierRaccordement } = gestionnaireRéseau;
    if (aideSaisieRéférenceDossierRaccordement?.expressionReguliere) {
      const isRefValid = new RegExp(
        aideSaisieRéférenceDossierRaccordement?.expressionReguliere,
      ).test(référenceDossierRaccordement);
      if (!isRefValid) {
        throw new FormatRéférenceDossierRaccordementInvalideError();
      }
    }

    const event: DemandeComplèteRaccordementTransmiseEvent = {
      type: 'DemandeComplèteDeRaccordementTransmise',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        dateQualification: dateQualification?.toISOString(),
        identifiantGestionnaireRéseau: formatIdentifiantGestionnaireRéseau(
          identifiantGestionnaireRéseau,
        ),
        référenceDossierRaccordement,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), event);
  };

  mediator.register('TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND', handler);
};

export const buildTransmettreDemandeComplèteRaccordementCommand =
  getMessageBuilder<TransmettreDemandeComplèteRaccordementCommand>(
    'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  );
