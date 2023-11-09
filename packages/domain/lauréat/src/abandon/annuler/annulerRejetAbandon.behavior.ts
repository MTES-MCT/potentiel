import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { AbandonAggregate } from '../abandon.aggregate';
import * as StatutAbandon from '../statutAbandon.valueType';

export type AnnulerRejetOptions = {
  dateAnnulation: DateTime.ValueType;
  utilisateur: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function annulerRejet(
  this: AbandonAggregate,
  { dateAnnulation, utilisateur, identifiantProjet }: AnnulerRejetOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.annulé);

  await this.annuler({
    dateAnnulation,
    identifiantProjet,
    utilisateur,
  });

  await this.demander({
    dateDemande: this.demande.demandéLe,
    identifiantProjet,
    raison: this.demande.raison,
    recandidature: this.demande.recandidature,
    utilisateur: this.demande.demandéPar,
    pièceJustificative: this.demande.pièceJustificative,
  });
}
