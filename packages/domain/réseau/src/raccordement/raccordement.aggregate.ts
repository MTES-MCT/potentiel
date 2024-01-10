import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { Option } from '@potentiel/monads';
import {
  DemandeComplèteRaccordementTransmiseEventV1,
  applyDemandeComplèteDeRaccordementTransmiseV1,
  transmettreDemande,
} from './transmettre/transmettreDemandeComplèteRaccordement.behavior';
import { IdentifiantGestionnaireRéseau } from '../gestionnaire';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from './référenceDossierRaccordement.valueType';
import { AucunRaccordementError } from './raccordementInconnu.error';
import {
  DateMiseEnServiceTransmiseEventV1,
  transmettreDateMiseEnService,
  applyDateMiseEnServiceTransmiseEventV1,
} from './transmettre/transmettreDateMiseEnService.behavior';
import { DossierRaccordementNonRéférencéError } from './dossierRaccordementNonRéférencé.error';
import {
  PropositionTechniqueEtFinancièreTransmiseEventV1,
  applyPropositionTechniqueEtFinancièreTransmiseEventV1,
  transmettrePropositionTechniqueEtFinancière,
} from './transmettre/transmettrePropositionTechniqueEtFinancière.behavior';

export type RaccordementRéseauEvent =
  | DemandeComplèteRaccordementTransmiseEventV1
  | PropositionTechniqueEtFinancièreTransmiseEventV1
  | DateMiseEnServiceTransmiseEventV1;

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
    case 'PropositionTechniqueEtFinancièreTransmise-V1':
      applyPropositionTechniqueEtFinancièreTransmiseEventV1.bind(this)(event);
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
