import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import {
  DépôtGarantiesFinancièresSoumisEvent,
  applyDépôtGarantiesFinancièresSoumis,
  soumettreDépôt,
} from './dépôt/soumettreDépôt/soumettreDépôtGarantiesFinancières.behavior';
import { StatutDépôtGarantiesFinancières, TypeGarantiesFinancières } from '.';
import { AucunesGarantiesFinancièresPourLeProjetError } from './aucunesGarantiesFinancièresPourLeProjet.error';
import {
  GarantiesFinancièresDemandéesEvent,
  demanderGarantiesFinancières,
} from './demander/demanderGarantiesFinancières.behavior';
import {
  DépôtGarantiesFinancièresEnCoursSuppriméEvent,
  applyDépôtGarantiesFinancièresEnCoursSupprimé,
  supprimerDépôtGarantiesFinancièresEnCours,
} from './dépôt/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.behavior';
import {
  DépôtGarantiesFinancièresEnCoursValidéEvent,
  applyDépôtGarantiesFinancièresEnCoursValidé,
  validerDépôtEnCours,
} from './dépôt/validerDépôtEnCours/validerDépôtGarantiesFinancièresEnCours.behavior';
import {
  DépôtGarantiesFinancièresEnCoursModifiéEvent,
  applyDépôtGarantiesFinancièresEnCoursModifié,
  modifierDépôtGarantiesFinancièresEnCours,
} from './dépôt/modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.behavior';
import {
  TypeGarantiesFinancièresImportéEvent,
  applyTypeGarantiesFinancièresImporté,
  importerType,
} from './importer/importerTypeGarantiesFinancières.behavior';
import {
  GarantiesFinancièresModifiéesEvent,
  applyModifierGarantiesFinancières,
  modifier,
} from './modifier/modifierGarantiesFinancières.behavior';
import {
  AttestationGarantiesFinancièresEnregistréeEvent,
  applyEnregistrerAttestationGarantiesFinancières,
  enregistrerAttestation,
} from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.behavior';
import {
  GarantiesFinancièresEnregistréesEvent,
  applyEnregistrerGarantiesFinancières,
  enregistrer,
} from './enregistrer/enregistrerGarantiesFinancières.behavior';
import {
  HistoriqueGarantiesFinancièresEffacéEvent,
  applyEffacerHistoriqueGarantiesFinancières,
  effacerHistorique,
} from './effacerHistorique/effacerHistoriqueGarantiesFinancières.behavior';

export type GarantiesFinancièresEvent =
  | DépôtGarantiesFinancièresSoumisEvent
  | GarantiesFinancièresDemandéesEvent
  | DépôtGarantiesFinancièresEnCoursSuppriméEvent
  | DépôtGarantiesFinancièresEnCoursValidéEvent
  | DépôtGarantiesFinancièresEnCoursModifiéEvent
  | TypeGarantiesFinancièresImportéEvent
  | GarantiesFinancièresModifiéesEvent
  | AttestationGarantiesFinancièresEnregistréeEvent
  | GarantiesFinancièresEnregistréesEvent
  | HistoriqueGarantiesFinancièresEffacéEvent;

export type GarantiesFinancièresAggregate = Aggregate<GarantiesFinancièresEvent> & {
  actuelles?: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution?: DateTime.ValueType;
    attestation?: { format: string };
    validéLe?: DateTime.ValueType;
    importéLe?: DateTime.ValueType;
  };
  dépôts?: Array<{
    statut: StatutDépôtGarantiesFinancières.ValueType;
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution: DateTime.ValueType;
    soumisLe: DateTime.ValueType;
    attestation?: { format: string };
  }>;
  dateLimiteSoumission?: DateTime.ValueType;
  readonly soumettreDépôt: typeof soumettreDépôt;
  readonly demanderGarantiesFinancières: typeof demanderGarantiesFinancières;
  readonly supprimerDépôtGarantiesFinancièresEnCours: typeof supprimerDépôtGarantiesFinancièresEnCours;
  readonly validerDépôtEnCours: typeof validerDépôtEnCours;
  readonly modifierDépôtGarantiesFinancièresEnCours: typeof modifierDépôtGarantiesFinancièresEnCours;
  readonly importerType: typeof importerType;
  readonly modifier: typeof modifier;
  readonly enregistrerAttestation: typeof enregistrerAttestation;
  readonly enregistrer: typeof enregistrer;
  readonly effacerHistorique: typeof effacerHistorique;
};

export const getDefaultGarantiesFinancièresAggregate: GetDefaultAggregateState<
  GarantiesFinancièresAggregate,
  GarantiesFinancièresEvent
> = () => ({
  apply,
  soumettreDépôt,
  demanderGarantiesFinancières,
  supprimerDépôtGarantiesFinancièresEnCours,
  validerDépôtEnCours: validerDépôtEnCours,
  modifierDépôtGarantiesFinancièresEnCours,
  importerType,
  modifier,
  enregistrerAttestation,
  enregistrer,
  effacerHistorique,
});

function apply(this: GarantiesFinancièresAggregate, event: GarantiesFinancièresEvent) {
  switch (event.type) {
    case 'DépôtGarantiesFinancièresSoumis-V1':
      applyDépôtGarantiesFinancièresSoumis.bind(this)(event);
      break;
    case 'DépôtGarantiesFinancièresEnCoursSupprimé-V1':
      applyDépôtGarantiesFinancièresEnCoursSupprimé.bind(this)();
      break;
    case 'DépôtGarantiesFinancièresEnCoursValidé-V1':
      applyDépôtGarantiesFinancièresEnCoursValidé.bind(this)(event);
      break;
    case 'DépôtGarantiesFinancièresEnCoursModifié-V1':
      applyDépôtGarantiesFinancièresEnCoursModifié.bind(this)(event);
      break;
    case 'TypeGarantiesFinancièresImporté-V1':
      applyTypeGarantiesFinancièresImporté.bind(this)(event);
      break;
    case 'GarantiesFinancièresModifiées-V1':
      applyModifierGarantiesFinancières.bind(this)(event);
      break;
    case 'AttestationGarantiesFinancièresEnregistrée-V1':
      applyEnregistrerAttestationGarantiesFinancières.bind(this)(event);
      break;
    case 'GarantiesFinancièresEnregistrées-V1':
      applyEnregistrerGarantiesFinancières.bind(this)(event);
      break;
    case 'HistoriqueGarantiesFinancièresEffacé-V1':
      applyEffacerHistoriqueGarantiesFinancières.bind(this)();
      break;
  }
}

export const loadGarantiesFinancièresFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `garanties-financieres|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultGarantiesFinancièresAggregate,
      onNone: throwOnNone
        ? () => {
            throw new AucunesGarantiesFinancièresPourLeProjetError();
          }
        : undefined,
    });
  };
