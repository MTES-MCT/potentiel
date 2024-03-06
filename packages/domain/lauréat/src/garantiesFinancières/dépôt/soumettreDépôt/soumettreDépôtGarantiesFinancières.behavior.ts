import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { DocumentProjet } from '@potentiel-domain/document';
import { ÉtatGarantiesFinancières, TypeGarantiesFinancières } from '../..';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DateConstitutionDansLeFutur } from '../../dateConstitutionDansLeFutur.error';
import { DateÉchéanceManquante } from '../../dateÉchéanceManquante.error';
import { DateÉchéanceNonAttendue } from '../../dateÉchéanceNonAttendue.error';

export type DépôtGarantiesFinancièresSoumisEvent = DomainEvent<
  'DépôtGarantiesFinancièresSoumis-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: TypeGarantiesFinancières.RawType;
    dateÉchéance?: DateTime.RawType;
    attestation: { format: string };
    dateConstitution: DateTime.RawType;
    soumisLe: DateTime.RawType;
    soumisPar: IdentifiantUtilisateur.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  type: TypeGarantiesFinancières.ValueType;
  dateÉchéance?: DateTime.ValueType;
  attestation: DocumentProjet.ValueType;
  dateConstitution: DateTime.ValueType;
  soumisLe: DateTime.ValueType;
  soumisPar: IdentifiantUtilisateur.ValueType;
};

export async function soumettreDépôt(
  this: GarantiesFinancièresAggregate,
  {
    attestation,
    dateConstitution,
    identifiantProjet,
    soumisLe,
    type,
    dateÉchéance,
    soumisPar,
  }: Options,
) {
  this.état?.vérifierQueLeChangementDÉtatEstPossibleEn(ÉtatGarantiesFinancières.dépôtEnCours);
  if (dateConstitution.estDansLeFutur()) {
    throw new DateConstitutionDansLeFutur();
  }
  if (type.estAvecDateÉchéance() && !dateÉchéance) {
    throw new DateÉchéanceManquante();
  }
  if (!type.estAvecDateÉchéance() && dateÉchéance) {
    throw new DateÉchéanceNonAttendue();
  }
  const event: DépôtGarantiesFinancièresSoumisEvent = {
    type: 'DépôtGarantiesFinancièresSoumis-V1',
    payload: {
      attestation: { format: attestation.format },
      dateConstitution: dateConstitution.formatter(),
      identifiantProjet: identifiantProjet.formatter(),
      soumisLe: soumisLe.formatter(),
      type: type.type,
      dateÉchéance: dateÉchéance?.formatter(),
      soumisPar: soumisPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyDépôtGarantiesFinancièresSoumis(
  this: GarantiesFinancièresAggregate,
  {
    payload: { type, dateÉchéance, dateConstitution, soumisLe, attestation },
  }: DépôtGarantiesFinancièresSoumisEvent,
) {
  (this.état = ÉtatGarantiesFinancières.dépôtEnCours),
    (this.dépôtEnCours = {
      type: TypeGarantiesFinancières.convertirEnValueType(type),
      dateÉchéance: dateÉchéance && DateTime.convertirEnValueType(dateÉchéance),
      dateConstitution: DateTime.convertirEnValueType(dateConstitution),
      soumisLe: DateTime.convertirEnValueType(soumisLe),
      attestation,
    });
}
