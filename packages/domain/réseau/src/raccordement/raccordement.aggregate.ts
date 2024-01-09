import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { Option } from '@potentiel/monads';
import {
  DemandeComplèteRaccordementTransmiseEventV1,
  applyDemandeComplèteDeRaccordementTransmiseV1,
  transmettreDemande,
} from './transmettre/transmettreDemandeComplèteRaccordement.behavior';
import { IdentifiantGestionnaireRéseau } from '../gestionnaire';
import { IdentifiantProjet } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from './référenceDossierRaccordement.valueType';
import { AucunRaccordementError } from './raccordementInconnu';

export type RaccordementRéseauEvent = DemandeComplèteRaccordementTransmiseEventV1;

export type RaccordementAggregate = Aggregate<RaccordementRéseauEvent> & {
  dossiers: Map<
    string,
    {
      référence: RéférenceDossierRaccordement.ValueType;
      demandeComplèteRaccordement: {
        dateQualification: Option<Date>;
        format: Option<string>;
      };
      miseEnService: {
        dateMiseEnService: Option<Date>;
      };
      propositionTechniqueEtFinancière: {
        dateSignature: Option<Date>;
        format: Option<string>;
      };
    }
  >;
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  readonly transmettreDemande: typeof transmettreDemande;
  contientLeDossier: (référence: RéférenceDossierRaccordement.ValueType) => boolean;
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
  contientLeDossier({ référence }) {
    return this.dossiers.has(référence);
  },
});

function apply(this: RaccordementAggregate, event: RaccordementRéseauEvent) {
  switch (event.type) {
    case 'DemandeComplèteDeRaccordementTransmise-V1':
      applyDemandeComplèteDeRaccordementTransmiseV1.bind(this)(event);
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
