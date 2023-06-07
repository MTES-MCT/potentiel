import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone, isSome } from '@potentiel/monads';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaireRéseau/gestionnaireRéseau.valueType';
import { IdentifiantProjet } from '../../projet/projet.valueType';
import { loadGestionnaireRéseauAggregateFactory } from '../../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import {
  FormatRéférenceDossierRaccordementInvalideError,
  PlusieursGestionnairesRéseauPourUnProjetError,
  RéférenceDossierRaccordementDéjàExistantPourLeProjetError,
} from '../raccordement.errors';
import { GestionnaireRéseauInconnuError } from '../../gestionnaireRéseau/gestionnaireRéseau.error';
import { DemandeComplèteRaccordementTransmiseEvent } from '../raccordement.event';
import { RéférenceDossierRaccordement } from '../raccordement.valueType';

export type TransmettreDemandeComplèteRaccordementCommand = Message<
  'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau;
    identifiantProjet: IdentifiantProjet;
    dateQualification?: Date;
    référenceDossierRaccordement: RéférenceDossierRaccordement;
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

    const demandeComplèteRaccordementTransmise: DemandeComplèteRaccordementTransmiseEvent = {
      type: 'DemandeComplèteDeRaccordementTransmise',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        dateQualification: dateQualification?.toISOString(),
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
