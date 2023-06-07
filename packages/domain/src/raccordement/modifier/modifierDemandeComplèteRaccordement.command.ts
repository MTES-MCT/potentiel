import { Message, MessageHandler, mediator } from 'mediateur';
import { Publish, LoadAggregate } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjet } from '../../projet/projet.valueType';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import {
  DossierRaccordementNonRéférencéError,
  FormatRéférenceDossierRaccordementInvalideError,
} from '../raccordement.errors';
import { GestionnaireRéseauInconnuError } from '../../gestionnaireRéseau/gestionnaireRéseau.error';
import {
  DemandeComplèteRaccordementModifiéeEventV1,
  RéférenceDossierRacordementModifiéeEventV1,
} from '../raccordement.event';
import { RéférenceDossierRaccordement } from '../raccordement.valueType';

export type ModifierDemandeComplèteRaccordementCommand = Message<
  'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  {
    identifiantProjet: IdentifiantProjet;
    dateQualification: Date;
    référenceDossierRaccordementActuelle: RéférenceDossierRaccordement;
    nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement;
  }
>;

export type ModifierDemandeComplèteRaccordementDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerModifierDemandeComplèteRaccordementCommand = ({
  publish,
  loadAggregate,
}: ModifierDemandeComplèteRaccordementDependencies) => {
  const loadRaccordement = loadRaccordementAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<ModifierDemandeComplèteRaccordementCommand> = async ({
    identifiantProjet,
    dateQualification,
    référenceDossierRaccordementActuelle,
    nouvelleRéférenceDossierRaccordement,
  }) => {
    const raccordement = await loadRaccordement(identifiantProjet);

    if (
      isNone(raccordement) ||
      !raccordement.contientLeDossier(référenceDossierRaccordementActuelle)
    ) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const gestionnaireRéseau = await raccordement.getGestionnaireRéseau();

    if (isNone(gestionnaireRéseau)) {
      throw new GestionnaireRéseauInconnuError();
    }

    if (
      !gestionnaireRéseau.validerRéférenceDossierRaccordement(nouvelleRéférenceDossierRaccordement)
    ) {
      throw new FormatRéférenceDossierRaccordementInvalideError();
    }

    const demandeComplèteRaccordementModifiée: DemandeComplèteRaccordementModifiéeEventV1 = {
      type: 'DemandeComplèteRaccordementModifiée-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossierRaccordement: référenceDossierRaccordementActuelle.formatter(),
        dateQualification: dateQualification.toISOString(),
      },
    };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      demandeComplèteRaccordementModifiée,
    );

    if (!référenceDossierRaccordementActuelle.estÉgaleÀ(nouvelleRéférenceDossierRaccordement)) {
      const référenceDossierRacordementModifiée: RéférenceDossierRacordementModifiéeEventV1 = {
        type: 'RéférenceDossierRacordementModifiée-V1',
        payload: {
          identifiantProjet: identifiantProjet.formatter(),
          nouvelleRéférenceDossierRaccordement: nouvelleRéférenceDossierRaccordement.formatter(),
          référenceDossierRaccordementActuelle: référenceDossierRaccordementActuelle.formatter(),
        },
      };

      await publish(
        createRaccordementAggregateId(identifiantProjet),
        référenceDossierRacordementModifiée,
      );
    }
  };

  mediator.register('MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND', handler);
};
