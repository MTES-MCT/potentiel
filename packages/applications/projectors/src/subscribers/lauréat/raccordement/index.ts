import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { raccordementRebuildTriggeredProjector } from './raccordementRebuildTriggered.projector.js';
import { raccordementSuppriméV1Projector } from './raccordementSuppriméV1.projector.js';
import {
  gestionnaireRéseauAttribuéV1Projector,
  gestionnaireRéseauInconnuAttribuéV1Projector,
  gestionnaireRéseauRaccordementModifiéV1Projector,
  gestionnaireRéseauRaccordementModifiéV2Projector,
} from './gestionnaire-réseau/index.js';
import {
  référenceDossierRacordementModifiéeV1Projector,
  référenceDossierRacordementModifiéeV2Projector,
} from './dossier-raccordement/référence/index.js';
import { dossierDuRaccordementSuppriméV1Projector } from './dossier-raccordement/dossierDuRaccordementSuppriméV1.projector.js';
import {
  accuséRéceptionDemandeComplèteRaccordementTransmisV1Projector,
  demandeComplèteDeRaccordementTransmiseV1Projector,
  demandeComplèteDeRaccordementTransmiseV2Projector,
  demandeComplèteDeRaccordementTransmiseV3Projector,
  demandeComplèteRaccordementModifiéeV1Projector,
  demandeComplèteRaccordementModifiéeV2Projector,
  demandeComplèteRaccordementModifiéeV3Projector,
  demandeComplèteRaccordementModifiéeV4Projector,
} from './dossier-raccordement/demandeComplèteDeRaccordement/index.js';
import {
  propositionTechniqueEtFinancièreModifiéeV1Projector,
  propositionTechniqueEtFinancièreModifiéeV2Projector,
  propositionTechniqueEtFinancièreModifiéeV3Projector,
  propositionTechniqueEtFinancièreSignéeTransmiseV1Projector,
  propositionTechniqueEtFinancièreTransmiseV1Projector,
  propositionTechniqueEtFinancièreTransmiseV2Projector,
  propositionTechniqueEtFinancièreTransmiseV3Projector,
} from './dossier-raccordement/propositionTechniqueEtFinancière/index.js';
import {
  dateMiseEnServiceSuppriméeV1Projector,
  dateMiseEnServiceTransmiseV1Projector,
  dateMiseEnServiceTransmiseV2Projector,
} from './dossier-raccordement/dateMiseEnService/index.js';

export type SubscriptionEvent = Lauréat.Raccordement.RaccordementEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Raccordement', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, raccordementRebuildTriggeredProjector)

      // Gestionnaire Réseau
      .with({ type: 'GestionnaireRéseauAttribué-V1' }, gestionnaireRéseauAttribuéV1Projector)
      .with(
        { type: 'GestionnaireRéseauInconnuAttribué-V1' },
        gestionnaireRéseauInconnuAttribuéV1Projector,
      )
      .with(
        { type: 'GestionnaireRéseauRaccordementModifié-V1' },
        gestionnaireRéseauRaccordementModifiéV1Projector,
      )
      .with(
        { type: 'GestionnaireRéseauRaccordementModifié-V2' },
        gestionnaireRéseauRaccordementModifiéV2Projector,
      )
      // Suppression du raccordement
      .with({ type: 'RaccordementSupprimé-V1' }, raccordementSuppriméV1Projector)

      // Dossier Raccordement
      .otherwise((event) =>
        match(event)
          // Référence

          .with(
            { type: 'RéférenceDossierRacordementModifiée-V1' },
            référenceDossierRacordementModifiéeV1Projector,
          )
          .with(
            { type: 'RéférenceDossierRacordementModifiée-V2' },
            référenceDossierRacordementModifiéeV2Projector,
          )

          // Demande Complète Raccordement

          .with(
            { type: 'DemandeComplèteDeRaccordementTransmise-V1' },
            demandeComplèteDeRaccordementTransmiseV1Projector,
          )
          .with(
            { type: 'DemandeComplèteDeRaccordementTransmise-V2' },
            demandeComplèteDeRaccordementTransmiseV2Projector,
          )
          .with(
            {
              type: 'DemandeComplèteDeRaccordementTransmise-V3',
            },
            demandeComplèteDeRaccordementTransmiseV3Projector,
          )
          .with(
            { type: 'DemandeComplèteRaccordementModifiée-V1' },
            demandeComplèteRaccordementModifiéeV1Projector,
          )
          .with(
            { type: 'DemandeComplèteRaccordementModifiée-V2' },
            demandeComplèteRaccordementModifiéeV2Projector,
          )
          .with(
            { type: 'DemandeComplèteRaccordementModifiée-V3' },
            demandeComplèteRaccordementModifiéeV3Projector,
          )
          .with(
            { type: 'DemandeComplèteRaccordementModifiée-V4' },
            demandeComplèteRaccordementModifiéeV4Projector,
          )
          .with(
            { type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1' },
            accuséRéceptionDemandeComplèteRaccordementTransmisV1Projector,
          )

          // Proposition Technique et Financière
          .with(
            { type: 'PropositionTechniqueEtFinancièreTransmise-V1' },
            propositionTechniqueEtFinancièreTransmiseV1Projector,
          )
          .with(
            { type: 'PropositionTechniqueEtFinancièreSignéeTransmise-V1' },
            propositionTechniqueEtFinancièreSignéeTransmiseV1Projector,
          )
          .with(
            { type: 'PropositionTechniqueEtFinancièreTransmise-V2' },
            propositionTechniqueEtFinancièreTransmiseV2Projector,
          )
          .with(
            { type: 'PropositionTechniqueEtFinancièreTransmise-V3' },
            propositionTechniqueEtFinancièreTransmiseV3Projector,
          )
          .with(
            { type: 'PropositionTechniqueEtFinancièreModifiée-V1' },
            propositionTechniqueEtFinancièreModifiéeV1Projector,
          )
          .with(
            { type: 'PropositionTechniqueEtFinancièreModifiée-V2' },
            propositionTechniqueEtFinancièreModifiéeV2Projector,
          )
          .with(
            { type: 'PropositionTechniqueEtFinancièreModifiée-V3' },
            propositionTechniqueEtFinancièreModifiéeV3Projector,
          )

          // Date de mise en service

          .with({ type: 'DateMiseEnServiceTransmise-V1' }, dateMiseEnServiceTransmiseV1Projector)
          .with({ type: 'DateMiseEnServiceTransmise-V2' }, dateMiseEnServiceTransmiseV2Projector)
          .with({ type: 'DateMiseEnServiceSupprimée-V1' }, dateMiseEnServiceSuppriméeV1Projector)

          // Suppression du dossier
          .with(
            {
              type: P.union('DossierDuRaccordementSupprimé-V1', 'DossierDuRaccordementSupprimé-V2'),
            },
            dossierDuRaccordementSuppriméV1Projector,
          )
          .exhaustive(),
      );

  mediator.register('System.Projector.Lauréat.Raccordement', handler);
};
