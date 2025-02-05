// Third party
import { match } from 'ts-pattern';

// Workspaces
import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';
import * as StatutChangementReprésentantLégal from '../statutChangementReprésentantLégal.valueType';
import { TypeReprésentantLégal } from '../..';
import { DemandeChangementInexistanteError } from '../changementReprésentantLégal.error';

export type ChangementReprésentantLégalAccordéEvent = DomainEvent<
  'ChangementReprésentantLégalAccordé-V1',
  {
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.RawType;
    accordAutomatique: boolean;
    avecCorrection?: true;
  }
>;

export type AccorderOptions = {
  dateAccord: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
} & (
  | {
      nomReprésentantLégal: string;
      typeReprésentantLégal: TypeReprésentantLégal.ValueType;
      accordAutomatique: false;
    }
  | {
      accordAutomatique: true;
    }
);

export async function accorder(this: ReprésentantLégalAggregate, options: AccorderOptions) {
  const { demande } = this;

  if (!demande) {
    throw new DemandeChangementInexistanteError();
  }

  const { dateAccord, identifiantUtilisateur, identifiantProjet, accordAutomatique } = options;

  demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementReprésentantLégal.accordé,
  );

  const nomReprésentantLégal = match(options)
    .with({ accordAutomatique: true }, () => demande.nom)
    .with({ accordAutomatique: false }, ({ nomReprésentantLégal }) => nomReprésentantLégal)
    .exhaustive();

  const typeReprésentantLégal = match(options)
    .with({ accordAutomatique: true }, () => demande.type)
    .with({ accordAutomatique: false }, ({ typeReprésentantLégal }) => typeReprésentantLégal)
    .exhaustive();

  const event: ChangementReprésentantLégalAccordéEvent = {
    type: 'ChangementReprésentantLégalAccordé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      accordéLe: dateAccord.formatter(),
      accordéPar: identifiantUtilisateur.formatter(),
      nomReprésentantLégal,
      typeReprésentantLégal: typeReprésentantLégal.formatter(),
      accordAutomatique,
      avecCorrection: demande.nom !== nomReprésentantLégal ? true : undefined,
    },
  };

  await this.publish(event);
}

export function applyChangementReprésentantLégalAccordé(
  this: ReprésentantLégalAggregate,
  {
    payload: { accordéLe, nomReprésentantLégal, typeReprésentantLégal },
  }: ChangementReprésentantLégalAccordéEvent,
) {
  if (this.demande) {
    this.demande.statut = StatutChangementReprésentantLégal.accordé;

    this.demande.accord = {
      accordéLe: DateTime.convertirEnValueType(accordéLe),
      nom: nomReprésentantLégal,
      type: TypeReprésentantLégal.convertirEnValueType(typeReprésentantLégal),
    };
  }
}
