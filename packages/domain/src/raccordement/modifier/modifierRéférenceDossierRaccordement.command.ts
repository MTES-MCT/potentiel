import { Message, MessageHandler, mediator } from 'mediateur';
import {
  IdentifiantProjetValueType,
  RéférenceDossierRaccordementValueType,
} from '../../domain.valueType';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { isNone } from '@potentiel/monads';
import {
  DossierRaccordementNonRéférencéError,
  FormatRéférenceDossierRaccordementInvalideError,
  RéférencesDossierRaccordementIdentiquesError,
} from '../raccordement.errors';
import { RéférenceDossierRacordementModifiéeEventV1 } from '../raccordement.event';
import {
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort,
  EnregistrerPropositionTechniqueEtFinancièreSignéePort,
} from '../raccordement.ports';
import { GestionnaireRéseauInconnuError } from '../../gestionnaireRéseau/gestionnaireRéseau.error';

export type ModifierRéférenceDossierRaccordementCommand = Message<
  'MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    référenceDossierRaccordementActuelle: RéférenceDossierRaccordementValueType;
    nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordementValueType;
  }
>;

export type ModifierRéférenceDossierRaccordementDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  enregistrerAccuséRéceptionDemandeComplèteRaccordement: EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort;
  enregistrerPropositionTechniqueEtFinancièreSignée: EnregistrerPropositionTechniqueEtFinancièreSignéePort;
};

export const registerModifierRéférenceDossierRaccordementCommand = ({
  publish,
  loadAggregate,
  enregistrerAccuséRéceptionDemandeComplèteRaccordement,
  enregistrerPropositionTechniqueEtFinancièreSignée,
}: ModifierRéférenceDossierRaccordementDependencies) => {
  const loadRaccordement = loadRaccordementAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<ModifierRéférenceDossierRaccordementCommand> = async ({
    identifiantProjet,
    référenceDossierRaccordementActuelle,
    nouvelleRéférenceDossierRaccordement,
  }) => {
    if (nouvelleRéférenceDossierRaccordement.estÉgaleÀ(référenceDossierRaccordementActuelle)) {
      throw new RéférencesDossierRaccordementIdentiquesError();
    }

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

    await Promise.all([
      enregistrerAccuséRéceptionDemandeComplèteRaccordement({
        opération: 'déplacement',
        type: 'demande-complete-raccordement',
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossierRaccordementActuelle: référenceDossierRaccordementActuelle.formatter(),
        nouvelleRéférenceDossierRaccordement: nouvelleRéférenceDossierRaccordement.formatter(),
      }),
      enregistrerPropositionTechniqueEtFinancièreSignée({
        opération: 'déplacement',
        type: 'proposition-technique-et-financiere',
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossierRaccordementActuelle: référenceDossierRaccordementActuelle.formatter(),
        nouvelleRéférenceDossierRaccordement: nouvelleRéférenceDossierRaccordement.formatter(),
      }),
    ]);

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
  };

  mediator.register('MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_COMMAND', handler);
};
