import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { Option } from '@potentiel/monads';
import {
  AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1,
  DemandeComplèteRaccordementTransmiseEvent,
  DemandeComplèteRaccordementTransmiseEventV1,
  applyAccuséRéceptionDemandeComplèteRaccordementTransmisEventV1,
  applyDemandeComplèteDeRaccordementTransmiseV1,
  applyDemandeComplèteDeRaccordementTransmiseV2,
  transmettreDemande,
} from './transmettre/transmettreDemandeComplèteRaccordement.behavior';
import { IdentifiantGestionnaireRéseau } from '../gestionnaire';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from './référenceDossierRaccordement.valueType';
import { AucunRaccordementError } from './raccordementInconnu.error';
import {
  DateMiseEnServiceTransmiseEvent,
  transmettreDateMiseEnService,
  applyDateMiseEnServiceTransmiseEventV1,
} from './transmettre/transmettreDateMiseEnService.behavior';
import { DossierRaccordementNonRéférencéError } from './dossierRaccordementNonRéférencé.error';
import {
  PropositionTechniqueEtFinancièreSignéeTransmiseEventV1,
  PropositionTechniqueEtFinancièreTransmiseEvent,
  PropositionTechniqueEtFinancièreTransmiseEventV1,
  applyPropositionTechniqueEtFinancièreSignéeTransmiseEventV1,
  applyPropositionTechniqueEtFinancièreTransmiseEventV1,
  applyPropositionTechniqueEtFinancièreTransmiseEventV2,
  transmettrePropositionTechniqueEtFinancière,
} from './transmettre/transmettrePropositionTechniqueEtFinancière.behavior';

export type DeprecateEvent =
  | DemandeComplèteRaccordementTransmiseEventV1
  | AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1
  | PropositionTechniqueEtFinancièreTransmiseEventV1
  | PropositionTechniqueEtFinancièreSignéeTransmiseEventV1;

export type RaccordementRéseauEvent =
  | DeprecateEvent
  | DemandeComplèteRaccordementTransmiseEvent
  | PropositionTechniqueEtFinancièreTransmiseEvent
  | DateMiseEnServiceTransmiseEvent;

type DossierRaccordement = {
  référence: RéférenceDossierRaccordement.ValueType;
  demandeComplèteRaccordement: {
    dateQualification: Option<DateTime.ValueType>;
    format: Option<string>;
  };
  miseEnService: {
    dateMiseEnService: Option<DateTime.ValueType>;
  };
  propositionTechniqueEtFinancière: {
    dateSignature: Option<DateTime.ValueType>;
    format: Option<string>;
  };
};

export type RaccordementAggregate = Aggregate<RaccordementRéseauEvent> & {
  dossiers: Map<string, DossierRaccordement>;
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  readonly transmettreDemande: typeof transmettreDemande;
  readonly transmettreDateMiseEnService: typeof transmettreDateMiseEnService;
  readonly transmettrePropositionTechniqueEtFinancière: typeof transmettrePropositionTechniqueEtFinancière;
  readonly contientLeDossier: (référence: RéférenceDossierRaccordement.ValueType) => boolean;
  readonly récupérerDossier: (référence: string) => DossierRaccordement;
};

export const getDefaultRaccordementAggregate: GetDefaultAggregateState<
  RaccordementAggregate,
  RaccordementRéseauEvent
> = () => ({
  dossiers: new Map(),
  identifiantProjet: IdentifiantProjet.inconnu,
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.inconnu,
  apply,
  transmettreDemande,
  transmettreDateMiseEnService,
  transmettrePropositionTechniqueEtFinancière,
  contientLeDossier({ référence }) {
    return this.dossiers.has(référence);
  },
  récupérerDossier(référence) {
    const dossier = this.dossiers.get(référence);

    if (!dossier) {
      throw new DossierRaccordementNonRéférencéError();
    }

    return dossier;
  },
});

function apply(this: RaccordementAggregate, event: RaccordementRéseauEvent) {
  switch (event.type) {
    case 'DemandeComplèteDeRaccordementTransmise-V1':
      applyDemandeComplèteDeRaccordementTransmiseV1.bind(this)(event);
      break;
    case 'DemandeComplèteDeRaccordementTransmise-V2':
      applyDemandeComplèteDeRaccordementTransmiseV2.bind(this)(event);
      break;
    case 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1':
      applyAccuséRéceptionDemandeComplèteRaccordementTransmisEventV1.bind(this)(event);
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
    case 'DateMiseEnServiceTransmise-V1':
      applyDateMiseEnServiceTransmiseEventV1.bind(this)(event);
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
            throw new AucunRaccordementError(identifiantProjet);
          }
        : undefined,
    });
  };
