// Third party
import { match } from 'ts-pattern';

// Workspaces
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';
import * as StatutChangementReprésentantLégal from '../statutChangementReprésentantLégal.valueType';
import { DemandeChangementInexistanteError } from '../changementReprésentantLégal.error';

export type AccorderOptions = {
  dateAccord: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
} & (
  | {
      nomReprésentantLégal: string;
      typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;
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

  const event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAccordéEvent = {
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
  }: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAccordéEvent,
) {
  if (this.demande) {
    this.demande.statut = StatutChangementReprésentantLégal.accordé;

    this.demande.accord = {
      accordéLe: DateTime.convertirEnValueType(accordéLe),
      nom: nomReprésentantLégal,
      type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.convertirEnValueType(
        typeReprésentantLégal,
      ),
    };
  }
}
