import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { AbandonAggregate } from '../abandon.aggregate';
import * as StatutAbandon from '../statutAbandon.valueType';
import { AbandonAnnuléEvent } from '../annuler/annulerAbandon.behavior';

export type AnnulerRejetOptions = {
  dateAnnulation: DateTime.ValueType;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function annulerRejet(
  this: AbandonAggregate,
  { dateAnnulation, identifiantUtilisateur, identifiantProjet }: AnnulerRejetOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.demandé);

  const event: AbandonAnnuléEvent = {
    type: 'AbandonAnnulé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      annuléLe: dateAnnulation.formatter(),
      annuléPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);

  await this.demander({
    dateDemande: this.demande.demandéLe,
    identifiantProjet,
    raison: this.demande.raison,
    identifiantUtilisateur: this.demande.demandéPar,
    pièceJustificative: this.demande.pièceJustificative,
  });
}
