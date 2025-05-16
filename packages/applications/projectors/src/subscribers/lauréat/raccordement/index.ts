import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Raccordement } from '@potentiel-domain/laureat';
import { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { raccordementRebuildTriggeredProjector } from './raccordementRebuildTriggered.projector';
import { gestionnaireRéseauRaccordementModifiéV1Projector } from './gestionnaireRéseauRaccordementModifiéV1.projector';
import { gestionnaireRéseauInconnuAttribuéV1Projector } from './gestionnaireRéseauInconnuAttribuéV1.projector';
import { gestionnaireRéseauAttribuéV1Projector } from './gestionnaireRéseauAttribuéV1.projector';
import { raccordementSuppriméV1Projector } from './raccordementSuppriméV1.projector';
import { accuséRéceptionDemandeComplèteRaccordementTransmisV1Projector } from './dossier-raccordement/accuséRéceptionDemandeComplèteRaccordementTransmisV1.projector';
import { dateMiseEnServiceTransmiseV1Projector } from './dossier-raccordement/dateMiseEnServiceTransmiseV1.projector';
import { dateMiseEnServiceTransmiseV2Projector } from './dossier-raccordement/dateMiseEnServiceTransmiseV2.projector';
import { demandeComplèteDeRaccordementTransmiseV1Projector } from './dossier-raccordement/demandeComplèteDeRaccordementTransmiseV1.projector';
import { demandeComplèteDeRaccordementTransmiseV2Projector } from './dossier-raccordement/demandeComplèteDeRaccordementTransmiseV2.projector';
import { demandeComplèteRaccordementModifiéeV1Projector } from './dossier-raccordement/demandeComplèteRaccordementModifiéeV1.projector';
import { demandeComplèteRaccordementModifiéeV2Projector } from './dossier-raccordement/demandeComplèteRaccordementModifiéeV2.projector';
import { demandeComplèteRaccordementModifiéeV3Projector } from './dossier-raccordement/demandeComplèteRaccordementModifiéeV3.projector';
import { propositionTechniqueEtFinancièreModifiéeV1Projector } from './dossier-raccordement/propositionTechniqueEtFinancièreModifiéeV1.projector';
import { propositionTechniqueEtFinancièreModifiéeV2Projector } from './dossier-raccordement/propositionTechniqueEtFinancièreModifiéeV2.projector';
import { propositionTechniqueEtFinancièreSignéeTransmiseV1Projector } from './dossier-raccordement/propositionTechniqueEtFinancièreSignéeTransmiseV1.projector';
import { propositionTechniqueEtFinancièreTransmiseV1Projector } from './dossier-raccordement/propositionTechniqueEtFinancièreTransmiseV1.projector';
import { propositionTechniqueEtFinancièreTransmiseV2Projector } from './dossier-raccordement/propositionTechniqueEtFinancièreTransmiseV2.projector';
import { référenceDossierRacordementModifiéeV1Projector } from './dossier-raccordement/référenceDossierRacordementModifiéeV1.projector';
import { référenceDossierRacordementModifiéeV2Projector } from './dossier-raccordement/référenceDossierRacordementModifiéeV2.projector';
import { dossierDuRaccordementSuppriméV1Projector } from './dossier-raccordement/dossierDuRaccordementSuppriméV1.projector';
import { dateMiseEnServiceSuppriméeV1Projector } from './dossier-raccordement/dateMiseEnServiceSuppriméeV1.projector';

export type SubscriptionEvent = (Raccordement.RaccordementEvent | RebuildTriggered) & Event;

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
            { type: 'PropositionTechniqueEtFinancièreModifiée-V1' },
            propositionTechniqueEtFinancièreModifiéeV1Projector,
          )
          .with(
            { type: 'PropositionTechniqueEtFinancièreModifiée-V2' },
            propositionTechniqueEtFinancièreModifiéeV2Projector,
          )

          // Date de mise en service

          .with({ type: 'DateMiseEnServiceTransmise-V1' }, dateMiseEnServiceTransmiseV1Projector)
          .with({ type: 'DateMiseEnServiceTransmise-V2' }, dateMiseEnServiceTransmiseV2Projector)
          .with({ type: 'DateMiseEnServiceSupprimée-V1' }, dateMiseEnServiceSuppriméeV1Projector)

          // Suppression du dossier
          .with(
            { type: 'DossierDuRaccordementSupprimé-V1' },
            dossierDuRaccordementSuppriméV1Projector,
          )
          .exhaustive(),
      );

  mediator.register('System.Projector.Lauréat.Raccordement', handler);
};
