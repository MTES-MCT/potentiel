import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';
import { StatutChangementReprésentantLégal, TypeDocumentChangementReprésentantLégal } from '../..';
import { ReprésentantLégalIdentifiqueError } from '../../représentantLégalIdentique.error';

import { ReprésentantLégalTypeInconnuError } from './demanderChangementReprésentantLégal.errors';

export type DemanderChangementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateDemande: DateTime.ValueType;
};

export async function demander(
  this: ReprésentantLégalAggregate,
  {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    identifiantUtilisateur,
    dateDemande,
  }: DemanderChangementOptions,
) {
  if (
    this.représentantLégal?.nom === nomReprésentantLégal &&
    this.représentantLégal.type.estÉgaleÀ(typeReprésentantLégal)
  ) {
    throw new ReprésentantLégalIdentifiqueError();
  }

  if (typeReprésentantLégal.estInconnu()) {
    throw new ReprésentantLégalTypeInconnuError();
  }

  if (this.demande) {
    this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementReprésentantLégal.demandé,
    );
  }

  const event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalDemandéEvent = {
    type: 'ChangementReprésentantLégalDemandé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      nomReprésentantLégal,
      typeReprésentantLégal: typeReprésentantLégal.formatter(),
      demandéLe: dateDemande.formatter(),
      demandéPar: identifiantUtilisateur.formatter(),
      pièceJustificative: { format: pièceJustificative.format },
    },
  };

  await this.publish(event);
}

export function applyChangementReprésentantLégalDemandé(
  this: ReprésentantLégalAggregate,
  {
    payload: {
      identifiantProjet,
      nomReprésentantLégal,
      typeReprésentantLégal,
      demandéLe,
      pièceJustificative: { format },
    },
  }: Lauréat.ReprésentantLégal.ChangementReprésentantLégalDemandéEvent,
) {
  this.demande = {
    statut: StatutChangementReprésentantLégal.demandé,
    nom: nomReprésentantLégal,
    type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.convertirEnValueType(
      typeReprésentantLégal,
    ),
    demandéLe: DateTime.convertirEnValueType(demandéLe),
    pièceJustificative: DocumentProjet.convertirEnValueType(
      identifiantProjet,
      TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
      demandéLe,
      format,
    ),
  };
}
