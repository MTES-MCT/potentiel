import { Message, MessageHandler, mediator } from 'mediateur';
import { Publish, LoadAggregate } from '@potentiel-domain/core';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import {
  DateDansLeFuturError,
  DossierRaccordementNonRéférencéError,
  FormatRéférenceDossierRaccordementInvalideError,
} from '../raccordement.errors';
import { GestionnaireRéseauInconnuError } from '../../gestionnaireRéseau/gestionnaireRéseau.error';
import { DemandeComplèteRaccordementModifiéeEventV2 } from '../raccordement.event';
import { RéférenceDossierRaccordementValueType } from '../raccordement.valueType';
import { DateTimeValueType } from '../../common/common.valueType';

export type ModifierDemandeComplèteRaccordementCommand = Message<
  'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    dateQualification: DateTimeValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordementValueType;
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
    référenceDossierRaccordement,
  }) => {
    if (dateQualification.estDansLeFutur()) {
      throw new DateDansLeFuturError();
    }

    const raccordement = await loadRaccordement(identifiantProjet);

    if (isNone(raccordement) || !raccordement.contientLeDossier(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const gestionnaireRéseau = await raccordement.getGestionnaireRéseau();

    if (isNone(gestionnaireRéseau)) {
      throw new GestionnaireRéseauInconnuError();
    }

    if (!gestionnaireRéseau.validerRéférenceDossierRaccordement(référenceDossierRaccordement)) {
      throw new FormatRéférenceDossierRaccordementInvalideError();
    }

    const demandeComplèteRaccordementModifiée: DemandeComplèteRaccordementModifiéeEventV2 = {
      type: 'DemandeComplèteRaccordementModifiée-V2',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
        dateQualification: dateQualification.formatter(),
      },
    };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      demandeComplèteRaccordementModifiée,
    );
  };

  mediator.register('MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND', handler);
};
