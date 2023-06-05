import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Publish, LoadAggregate } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import {
  loadRaccordementAggregateFactory,
  createRaccordementAggregateId,
} from '../../raccordement.aggregate';
import { DemandeComplèteRaccordementModifiéeEvent } from './demandeComplèteRaccordementModifiée.event';
import {
  DossierRaccordementNonRéférencéError,
  FormatRéférenceDossierRaccordementInvalideError,
} from '../../raccordement.errors';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/projet.valueType';
import { loadGestionnaireRéseauAggregateFactory } from '../../../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import { GestionnaireRéseauInconnuError } from '../../../gestionnaireRéseau/modifier/gestionnaireRéseauInconnu.error';

export type ModifierDemandeComplèteRaccordementCommand = Message<
  'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  {
    identifiantProjet: IdentifiantProjet;
    dateQualification: Date;
    ancienneRéférenceDossierRaccordement: string;
    nouvelleRéférenceDossierRaccordement: string;
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
  const loadGestionnaireRéseau = loadGestionnaireRéseauAggregateFactory({ loadAggregate });
  const loadRaccordement = loadRaccordementAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<ModifierDemandeComplèteRaccordementCommand> = async ({
    identifiantProjet,
    dateQualification,
    ancienneRéférenceDossierRaccordement,
    nouvelleRéférenceDossierRaccordement,
  }) => {
    const raccordement = await loadRaccordement(identifiantProjet);

    if (
      isNone(raccordement) ||
      !raccordement.références.includes(ancienneRéférenceDossierRaccordement)
    ) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const gestionnaireRéseau = await loadGestionnaireRéseau({
      codeEIC: raccordement.gestionnaireRéseau.codeEIC,
    });

    if (isNone(gestionnaireRéseau)) {
      throw new GestionnaireRéseauInconnuError();
    }

    const { aideSaisieRéférenceDossierRaccordement } = gestionnaireRéseau;
    if (aideSaisieRéférenceDossierRaccordement?.expressionReguliere) {
      const isRefValid = new RegExp(
        aideSaisieRéférenceDossierRaccordement?.expressionReguliere,
      ).test(nouvelleRéférenceDossierRaccordement);
      if (!isRefValid) {
        throw new FormatRéférenceDossierRaccordementInvalideError();
      }
    }

    const demandeComplèteRaccordementModifiéeEvent: DemandeComplèteRaccordementModifiéeEvent = {
      type: 'DemandeComplèteRaccordementModifiée',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        dateQualification: dateQualification.toISOString(),
        referenceActuelle: ancienneRéférenceDossierRaccordement,
        nouvelleReference: nouvelleRéférenceDossierRaccordement,
      },
    };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      demandeComplèteRaccordementModifiéeEvent,
    );
  };

  mediator.register('MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND', handler);
};

export const buildModifierDemandeComplèteRaccordementCommand =
  getMessageBuilder<ModifierDemandeComplèteRaccordementCommand>(
    'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  );
