import { Message, MessageHandler, mediator } from 'mediateur';
import {
  IdentifiantProjetValueType,
  RéférenceDossierRaccordementValueType,
  Utilisateur,
  utilisateurEstPorteur,
} from '../../domain.valueType';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { isNone, isSome } from '@potentiel/monads';
import {
  DossierRaccordementNonRéférencéError,
  FormatRéférenceDossierRaccordementInvalideError,
  RéférenceDossierRaccordementNonModifiableCarDossierAvecDateDeMiseEnServiceError,
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
    utilisateur: Utilisateur;
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
    utilisateur,
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

    if (utilisateurEstPorteur(utilisateur)) {
      const dossier = raccordement.dossiers.get(référenceDossierRaccordementActuelle.formatter());
      if (isSome(dossier?.miseEnService.dateMiseEnService)) {
        throw new RéférenceDossierRaccordementNonModifiableCarDossierAvecDateDeMiseEnServiceError();
      }
    }

    await enregistrerAccuséRéceptionDemandeComplèteRaccordement({
      opération: 'déplacement',
      type: 'demande-complete-raccordement',
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossierRaccordementActuelle: référenceDossierRaccordementActuelle.formatter(),
      nouvelleRéférenceDossierRaccordement: nouvelleRéférenceDossierRaccordement.formatter(),
    });

    await enregistrerPropositionTechniqueEtFinancièreSignée({
      opération: 'déplacement',
      type: 'proposition-technique-et-financiere',
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossierRaccordementActuelle: référenceDossierRaccordementActuelle.formatter(),
      nouvelleRéférenceDossierRaccordement: nouvelleRéférenceDossierRaccordement.formatter(),
    });

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
