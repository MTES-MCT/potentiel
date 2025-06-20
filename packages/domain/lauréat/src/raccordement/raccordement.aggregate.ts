import { match, P } from 'ts-pattern';

import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { IdentifiantProjet, Raccordement } from '@potentiel-domain/projet';

import {
  applyAccuséRéceptionDemandeComplèteRaccordementTransmisEventV1,
  applyDemandeComplèteDeRaccordementTransmiseEventV1,
  applyDemandeComplèteDeRaccordementTransmiseEventV2,
  applyDemandeComplèteDeRaccordementTransmiseEventV3,
  transmettreDemande,
} from './transmettre/transmettreDemandeComplèteRaccordement.behavior';
import * as RéférenceDossierRaccordement from './référenceDossierRaccordement.valueType';
import {
  transmettreDateMiseEnService,
  applyDateMiseEnServiceTransmiseEventV1,
  applyDateMiseEnServiceTransmiseEventV2,
} from './transmettre/transmettreDateMiseEnService.behavior';
import { DossierNonRéférencéPourLeRaccordementDuProjetError } from './dossierNonRéférencéPourLeRaccordementDuProjet.error';
import {
  applyPropositionTechniqueEtFinancièreSignéeTransmiseEventV1,
  applyPropositionTechniqueEtFinancièreTransmiseEventV1,
  applyPropositionTechniqueEtFinancièreTransmiseEventV2,
  transmettrePropositionTechniqueEtFinancière,
} from './transmettre/transmettrePropositionTechniqueEtFinancière.behavior';
import {
  applyDemandeComplèteRaccordementModifiéeEventV1,
  applyDemandeComplèteRaccordementModifiéeEventV2,
  applyDemandeComplèteRaccordementModifiéeEventV3,
  modifierDemandeComplèteRaccordement,
} from './modifier/modifierDemandeComplèteRaccordement.behavior';
import {
  applyRéférenceDossierRacordementModifiéeEvent,
  modifierRéférenceDossierRacordement,
} from './modifier/modifierRéférenceDossierRaccordement.behavior';
import {
  applyPropositionTechniqueEtFinancièreModifiéeEventV1,
  applyPropositionTechniqueEtFinancièreModifiéeEventV2,
  modifierPropositionTechniqueEtFinancière,
} from './modifier/modifierPropositiontechniqueEtFinancière.behavior';
import {
  applyGestionnaireRéseauRaccordemenInconnuEventV1,
  applyGestionnaireRéseauRaccordementModifiéEventV1,
  modifierGestionnaireRéseau,
} from './modifier/modifierGestionnaireRéseauRaccordement.behavior';
import {
  applyAttribuerGestionnaireRéseauEventV1,
  attribuerGestionnaireRéseau,
} from './attribuer/attribuerGestionnaireRéseau.behavior';
import {
  applyDossierDuRaccordementSuppriméEventV1,
  supprimerDossier,
} from './dossier/supprimer/supprimerDossierDuRaccordement.behavior';
import {
  applyRaccordementSuppriméEventV1,
  supprimerRaccordement,
} from './supprimer/supprimerRaccordement.behavior';
import {
  applyDateMiseEnServiceSuppriméeEventV1,
  supprimerDateMiseEnService,
} from './supprimer/supprimerDateMiseEnService.behavior';

export type DeprecateEvent =
  | Raccordement.DemandeComplèteRaccordementTransmiseEventV1
  | Raccordement.DemandeComplèteRaccordementTransmiseEventV2
  | Raccordement.AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1
  | Raccordement.PropositionTechniqueEtFinancièreTransmiseEventV1
  | Raccordement.PropositionTechniqueEtFinancièreSignéeTransmiseEventV1
  | Raccordement.DemandeComplèteRaccordementModifiéeEventV1
  | Raccordement.DemandeComplèteRaccordementModifiéeEventV2
  | Raccordement.PropositionTechniqueEtFinancièreModifiéeEventV1
  | Raccordement.DateMiseEnServiceTransmiseV1Event
  | Raccordement.RéférenceDossierRacordementModifiéeEventV1;

export type RaccordementEvent =
  | DeprecateEvent
  | Raccordement.DemandeComplèteRaccordementTransmiseEvent
  | Raccordement.PropositionTechniqueEtFinancièreTransmiseEvent
  | Raccordement.DateMiseEnServiceTransmiseEvent
  | Raccordement.DateMiseEnServiceSuppriméeEvent
  | Raccordement.DemandeComplèteRaccordementModifiéeEvent
  | Raccordement.RéférenceDossierRacordementModifiéeEvent
  | Raccordement.PropositionTechniqueEtFinancièreModifiéeEvent
  | Raccordement.GestionnaireRéseauRaccordementModifiéEvent
  | Raccordement.GestionnaireRéseauInconnuAttribuéEvent
  | Raccordement.GestionnaireRéseauAttribuéEvent
  | Raccordement.DossierDuRaccordementSuppriméEvent
  | Raccordement.RaccordementSuppriméEvent;

type DossierRaccordement = {
  référence: RéférenceDossierRaccordement.ValueType;
  demandeComplèteRaccordement: {
    dateQualification: Option.Type<DateTime.ValueType>;
    format: Option.Type<string>;
  };
  miseEnService: {
    dateMiseEnService: Option.Type<DateTime.ValueType>;
  };
  propositionTechniqueEtFinancière: {
    dateSignature: Option.Type<DateTime.ValueType>;
    format: Option.Type<string>;
  };
};

export type RaccordementAggregate = Aggregate<RaccordementEvent> & {
  dossiers: Map<string, DossierRaccordement>;
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  readonly transmettreDemande: typeof transmettreDemande;
  readonly transmettreDateMiseEnService: typeof transmettreDateMiseEnService;
  readonly supprimerDateMiseEnService: typeof supprimerDateMiseEnService;
  readonly transmettrePropositionTechniqueEtFinancière: typeof transmettrePropositionTechniqueEtFinancière;
  readonly modifierDemandeComplèteRaccordement: typeof modifierDemandeComplèteRaccordement;
  readonly modifierRéférenceDossierRacordement: typeof modifierRéférenceDossierRacordement;
  readonly modifierPropositionTechniqueEtFinancière: typeof modifierPropositionTechniqueEtFinancière;
  readonly modifierGestionnaireRéseau: typeof modifierGestionnaireRéseau;
  readonly contientLeDossier: (référence: RéférenceDossierRaccordement.ValueType) => boolean;
  readonly récupérerDossier: (référence: string) => DossierRaccordement;
  readonly aUneDateDeMiseEnService: () => boolean;
  readonly attribuerGestionnaireRéseau: typeof attribuerGestionnaireRéseau;
  readonly supprimerDossier: typeof supprimerDossier;
  readonly supprimerRaccordement: typeof supprimerRaccordement;
  readonly dateModifiée: (
    référence: RéférenceDossierRaccordement.ValueType,
    nouvelleDate: DateTime.ValueType,
  ) => boolean;
};

export const getDefaultRaccordementAggregate: GetDefaultAggregateState<
  RaccordementAggregate,
  RaccordementEvent
> = () => ({
  dossiers: new Map(),
  identifiantProjet: IdentifiantProjet.inconnu,
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
  apply,
  transmettreDemande,
  transmettreDateMiseEnService,
  transmettrePropositionTechniqueEtFinancière,
  modifierDemandeComplèteRaccordement,
  modifierRéférenceDossierRacordement,
  modifierPropositionTechniqueEtFinancière,
  modifierGestionnaireRéseau,
  attribuerGestionnaireRéseau,
  supprimerDossier,
  supprimerRaccordement,
  supprimerDateMiseEnService,
  contientLeDossier({ référence }) {
    return this.dossiers.has(référence);
  },
  récupérerDossier(référence) {
    const dossier = this.dossiers.get(référence);

    if (!dossier) {
      throw new DossierNonRéférencéPourLeRaccordementDuProjetError();
    }

    return dossier;
  },
  aUneDateDeMiseEnService(): boolean {
    for (const [, dossier] of this.dossiers.entries()) {
      if (Option.isSome(dossier.miseEnService.dateMiseEnService)) {
        return true;
      }
    }
    return false;
  },
  dateModifiée({ référence }, date) {
    const dossier = this.récupérerDossier(référence);
    if (
      !dossier.miseEnService?.dateMiseEnService ||
      Option.isNone(dossier.miseEnService.dateMiseEnService)
    ) {
      return true;
    }
    return !date.estÉgaleÀ(dossier.miseEnService.dateMiseEnService);
  },
});

function apply(this: RaccordementAggregate, event: RaccordementEvent) {
  return match(event)
    .with({ type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1' }, (event) =>
      applyAccuséRéceptionDemandeComplèteRaccordementTransmisEventV1.bind(this)(event),
    )
    .with({ type: 'DemandeComplèteDeRaccordementTransmise-V1' }, (event) =>
      applyDemandeComplèteDeRaccordementTransmiseEventV1.bind(this)(event),
    )
    .with({ type: 'DemandeComplèteDeRaccordementTransmise-V2' }, (event) =>
      applyDemandeComplèteDeRaccordementTransmiseEventV2.bind(this)(event),
    )
    .with({ type: 'DemandeComplèteDeRaccordementTransmise-V3' }, (event) =>
      applyDemandeComplèteDeRaccordementTransmiseEventV3.bind(this)(event),
    )
    .with({ type: 'DemandeComplèteRaccordementModifiée-V1' }, (event) =>
      applyDemandeComplèteRaccordementModifiéeEventV1.bind(this)(event),
    )
    .with({ type: 'DemandeComplèteRaccordementModifiée-V2' }, (event) =>
      applyDemandeComplèteRaccordementModifiéeEventV2.bind(this)(event),
    )
    .with({ type: 'DemandeComplèteRaccordementModifiée-V3' }, (event) =>
      applyDemandeComplèteRaccordementModifiéeEventV3.bind(this)(event),
    )
    .with(
      {
        type: P.union(
          'RéférenceDossierRacordementModifiée-V1',
          'RéférenceDossierRacordementModifiée-V2',
        ),
      },
      (event) => applyRéférenceDossierRacordementModifiéeEvent.bind(this)(event),
    )
    .with({ type: 'PropositionTechniqueEtFinancièreTransmise-V1' }, (event) =>
      applyPropositionTechniqueEtFinancièreTransmiseEventV1.bind(this)(event),
    )
    .with({ type: 'PropositionTechniqueEtFinancièreSignéeTransmise-V1' }, (event) =>
      applyPropositionTechniqueEtFinancièreSignéeTransmiseEventV1.bind(this)(event),
    )
    .with({ type: 'PropositionTechniqueEtFinancièreTransmise-V2' }, (event) =>
      applyPropositionTechniqueEtFinancièreTransmiseEventV2.bind(this)(event),
    )
    .with({ type: 'PropositionTechniqueEtFinancièreModifiée-V1' }, (event) =>
      applyPropositionTechniqueEtFinancièreModifiéeEventV1.bind(this)(event),
    )
    .with({ type: 'PropositionTechniqueEtFinancièreModifiée-V2' }, (event) =>
      applyPropositionTechniqueEtFinancièreModifiéeEventV2.bind(this)(event),
    )
    .with({ type: 'DateMiseEnServiceTransmise-V1' }, (event) =>
      applyDateMiseEnServiceTransmiseEventV1.bind(this)(event),
    )
    .with({ type: 'DateMiseEnServiceTransmise-V2' }, (event) =>
      applyDateMiseEnServiceTransmiseEventV2.bind(this)(event),
    )
    .with({ type: 'GestionnaireRéseauRaccordementModifié-V1' }, (event) =>
      applyGestionnaireRéseauRaccordementModifiéEventV1.bind(this)(event),
    )
    .with({ type: 'GestionnaireRéseauInconnuAttribué-V1' }, (event) =>
      applyGestionnaireRéseauRaccordemenInconnuEventV1.bind(this)(event),
    )
    .with({ type: 'GestionnaireRéseauAttribué-V1' }, (event) =>
      applyAttribuerGestionnaireRéseauEventV1.bind(this)(event),
    )
    .with({ type: 'DossierDuRaccordementSupprimé-V1' }, (event) =>
      applyDossierDuRaccordementSuppriméEventV1.bind(this)(event),
    )
    .with({ type: 'RaccordementSupprimé-V1' }, (event) =>
      applyRaccordementSuppriméEventV1.bind(this)(event),
    )
    .with({ type: 'DateMiseEnServiceSupprimée-V1' }, (event) =>
      applyDateMiseEnServiceSuppriméeEventV1.bind(this)(event),
    )
    .exhaustive();
}

export const loadRaccordementAggregateFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `raccordement|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultRaccordementAggregate,
      onNone: throwOnNone
        ? () => {
            throw new RaccordementInconnuError(identifiantProjet);
          }
        : undefined,
    });
  };

class RaccordementInconnuError extends AggregateNotFoundError {
  constructor(identifiantProjet: IdentifiantProjet.ValueType) {
    super(`Raccordement inconnu`, {
      identifiantProjet: identifiantProjet.formatter(),
    });
  }
}
