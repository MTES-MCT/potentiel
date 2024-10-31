import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { IdentifiantGestionnaireRéseau } from '../gestionnaire';

import {
  AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1,
  DemandeComplèteRaccordementTransmiseEvent,
  DemandeComplèteRaccordementTransmiseEventV1,
  applyAccuséRéceptionDemandeComplèteRaccordementTransmisEventV1,
  applyDemandeComplèteDeRaccordementTransmiseEventV1,
  applyDemandeComplèteDeRaccordementTransmiseEventV2,
  transmettreDemande,
} from './transmettre/transmettreDemandeComplèteRaccordement.behavior';
import * as RéférenceDossierRaccordement from './référenceDossierRaccordement.valueType';
import {
  DateMiseEnServiceTransmiseEvent,
  transmettreDateMiseEnService,
  applyDateMiseEnServiceTransmiseEventV1,
} from './transmettre/transmettreDateMiseEnService.behavior';
import { DossierNonRéférencéPourLeRaccordementDuProjetError } from './dossierNonRéférencéPourLeRaccordementDuProjet.error';
import {
  PropositionTechniqueEtFinancièreSignéeTransmiseEventV1,
  PropositionTechniqueEtFinancièreTransmiseEvent,
  PropositionTechniqueEtFinancièreTransmiseEventV1,
  applyPropositionTechniqueEtFinancièreSignéeTransmiseEventV1,
  applyPropositionTechniqueEtFinancièreTransmiseEventV1,
  applyPropositionTechniqueEtFinancièreTransmiseEventV2,
  transmettrePropositionTechniqueEtFinancière,
} from './transmettre/transmettrePropositionTechniqueEtFinancière.behavior';
import {
  DemandeComplèteRaccordementModifiéeEvent,
  DemandeComplèteRaccordementModifiéeEventV1,
  DemandeComplèteRaccordementModifiéeEventV2,
  applyDemandeComplèteRaccordementModifiéeEventV1,
  applyDemandeComplèteRaccordementModifiéeEventV2,
  applyDemandeComplèteRaccordementModifiéeEventV3,
  modifierDemandeComplèteRaccordement,
} from './modifier/modifierDemandeComplèteRaccordement.behavior';
import {
  RéférenceDossierRacordementModifiéeEvent,
  applyRéférenceDossierRacordementModifiéeEventV1,
  modifierRéférenceDossierRacordement,
} from './modifier/modifierRéférenceDossierRaccordement.behavior';
import {
  PropositionTechniqueEtFinancièreModifiéeEvent,
  PropositionTechniqueEtFinancièreModifiéeEventV1,
  applyPropositionTechniqueEtFinancièreModifiéeEventV1,
  applyPropositionTechniqueEtFinancièreModifiéeEventV2,
  modifierPropositionTechniqueEtFinancière,
} from './modifier/modifierPropositiontechniqueEtFinancière.behavior';
import {
  GestionnaireRéseauRaccordementModifiéEvent,
  applyGestionnaireRéseauRaccordemenInconnuEventV1,
  applyGestionnaireRéseauRaccordementModifiéEventV1,
  modifierGestionnaireRéseau,
} from './modifier/modifierGestionnaireRéseauRaccordement.behavior';
import {
  GestionnaireRéseauAttribuéEvent,
  applyAttribuerGestionnaireRéseauEventV1,
  attribuerGestionnaireRéseau,
  GestionnaireRéseauInconnuAttribuéEvent,
} from './attribuer/attribuerGestionnaireRéseau.behavior';
import {
  applyDossierDuRaccordementSuppriméEventV1,
  DossierDuRaccordementSuppriméEvent,
  supprimerDossier,
} from './dossier/supprimer/supprimerDossierDuRaccordement.behavior';
import {
  applyRaccordementSuppriméEventV1,
  RaccordementSuppriméEvent,
  supprimerRaccordement,
} from './supprimer/supprimerRaccordement.behavior';
import {
  applyDateMiseEnServiceModifiéeEventV1,
  DateMiseEnServiceModifiéeEvent,
  modifierDateMiseEnService,
} from './modifier/modifierDateMiseEnService.behavior';

export type DeprecateEvent =
  | DemandeComplèteRaccordementTransmiseEventV1
  | AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1
  | PropositionTechniqueEtFinancièreTransmiseEventV1
  | PropositionTechniqueEtFinancièreSignéeTransmiseEventV1
  | DemandeComplèteRaccordementModifiéeEventV1
  | DemandeComplèteRaccordementModifiéeEventV2
  | PropositionTechniqueEtFinancièreModifiéeEventV1;

export type RaccordementEvent =
  | DeprecateEvent
  | DemandeComplèteRaccordementTransmiseEvent
  | PropositionTechniqueEtFinancièreTransmiseEvent
  | DateMiseEnServiceTransmiseEvent
  | DateMiseEnServiceModifiéeEvent
  | DemandeComplèteRaccordementModifiéeEvent
  | RéférenceDossierRacordementModifiéeEvent
  | PropositionTechniqueEtFinancièreModifiéeEvent
  | GestionnaireRéseauRaccordementModifiéEvent
  | GestionnaireRéseauInconnuAttribuéEvent
  | GestionnaireRéseauAttribuéEvent
  | DossierDuRaccordementSuppriméEvent
  | RaccordementSuppriméEvent;

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
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  readonly transmettreDemande: typeof transmettreDemande;
  readonly transmettreDateMiseEnService: typeof transmettreDateMiseEnService;
  readonly transmettrePropositionTechniqueEtFinancière: typeof transmettrePropositionTechniqueEtFinancière;
  readonly modifierDateMiseEnService: typeof modifierDateMiseEnService;
  readonly modifierDemandeComplèteRaccordement: typeof modifierDemandeComplèteRaccordement;
  readonly modifierRéférenceDossierRacordement: typeof modifierRéférenceDossierRacordement;
  readonly modifierPropositionTechniqueEtFinancière: typeof modifierPropositionTechniqueEtFinancière;
  readonly modifierGestionnaireRéseau: typeof modifierGestionnaireRéseau;
  readonly contientLeDossier: (référence: RéférenceDossierRaccordement.ValueType) => boolean;
  readonly récupérerDossier: (référence: string) => DossierRaccordement;
  readonly aUneDateDeMiseEnService: (référence?: RéférenceDossierRaccordement.ValueType) => boolean;
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
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.inconnu,
  apply,
  transmettreDemande,
  transmettreDateMiseEnService,
  transmettrePropositionTechniqueEtFinancière,
  modifierDateMiseEnService,
  modifierDemandeComplèteRaccordement,
  modifierRéférenceDossierRacordement,
  modifierPropositionTechniqueEtFinancière,
  modifierGestionnaireRéseau,
  attribuerGestionnaireRéseau,
  supprimerDossier,
  supprimerRaccordement,
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
  switch (event.type) {
    case 'DemandeComplèteDeRaccordementTransmise-V1':
      applyDemandeComplèteDeRaccordementTransmiseEventV1.bind(this)(event);
      break;
    case 'DemandeComplèteDeRaccordementTransmise-V2':
      applyDemandeComplèteDeRaccordementTransmiseEventV2.bind(this)(event);
      break;
    case 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1':
      applyAccuséRéceptionDemandeComplèteRaccordementTransmisEventV1.bind(this)(event);
      break;
    case 'DemandeComplèteRaccordementModifiée-V1':
      applyDemandeComplèteRaccordementModifiéeEventV1.bind(this)(event);
      break;
    case 'DemandeComplèteRaccordementModifiée-V2':
      applyDemandeComplèteRaccordementModifiéeEventV2.bind(this)(event);
      break;
    case 'DemandeComplèteRaccordementModifiée-V3':
      applyDemandeComplèteRaccordementModifiéeEventV3.bind(this)(event);
      break;
    case 'RéférenceDossierRacordementModifiée-V1':
      applyRéférenceDossierRacordementModifiéeEventV1.bind(this)(event);
      break;
    case 'PropositionTechniqueEtFinancièreTransmise-V1':
      applyPropositionTechniqueEtFinancièreTransmiseEventV1.bind(this)(event);
      break;
    case 'PropositionTechniqueEtFinancièreSignéeTransmise-V1':
      applyPropositionTechniqueEtFinancièreSignéeTransmiseEventV1.bind(this)(event);
      break;
    case 'PropositionTechniqueEtFinancièreTransmise-V2':
      applyPropositionTechniqueEtFinancièreTransmiseEventV2.bind(this)(event);
      break;
    case 'PropositionTechniqueEtFinancièreModifiée-V1':
      applyPropositionTechniqueEtFinancièreModifiéeEventV1.bind(this)(event);
      break;
    case 'PropositionTechniqueEtFinancièreModifiée-V2':
      applyPropositionTechniqueEtFinancièreModifiéeEventV2.bind(this)(event);
      break;
    case 'DateMiseEnServiceTransmise-V1':
      applyDateMiseEnServiceTransmiseEventV1.bind(this)(event);
      break;
    case 'DateMiseEnServiceModifiée-V1':
      applyDateMiseEnServiceModifiéeEventV1.bind(this)(event);
      break;
    case 'GestionnaireRéseauRaccordementModifié-V1':
      applyGestionnaireRéseauRaccordementModifiéEventV1.bind(this)(event);
      break;
    case 'GestionnaireRéseauInconnuAttribué-V1':
      applyGestionnaireRéseauRaccordemenInconnuEventV1.bind(this)(event);
      break;
    case 'GestionnaireRéseauAttribué-V1':
      applyAttribuerGestionnaireRéseauEventV1.bind(this)(event);
      break;
    case 'DossierDuRaccordementSupprimé-V1':
      applyDossierDuRaccordementSuppriméEventV1.bind(this)(event);
      break;
    case 'RaccordementSupprimé-V1':
      applyRaccordementSuppriméEventV1.bind(this)(event);
      break;
  }
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
