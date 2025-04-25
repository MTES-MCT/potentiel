import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { PuissanceIdentiqueError, PuissanceNulleOuNégativeError } from '../../errors';
import { AutoritéCompétente, RatioChangementPuissance, StatutChangementPuissance } from '../..';
import { PuissanceAggregate } from '../../puissance.aggregate';
import {
  ProjetAbandonnéError,
  ProjetAvecDemandeAbandonEnCoursError,
  ProjetAchevéError,
  AppelOffreInexistantError,
  CahierDesChargesInexistantError,
  PériodeInexistanteError,
} from '../errors';

export type ChangementPuissanceDemandéEvent = DomainEvent<
  'ChangementPuissanceDemandé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    autoritéCompétente: AutoritéCompétente.RawType;
    raison: string;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    pièceJustificative: {
      format: string;
    };
  }
>;

export type DemanderOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nouvellePuissance: number;
  puissanceInitiale: number;
  raison: string;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateDemande: DateTime.ValueType;
  estAbandonné: boolean;
  demandeAbandonEnCours: boolean;
  estAchevé: boolean;
  appelOffre: Option.Type<AppelOffre.ConsulterAppelOffreReadModel>;
  technologie: Candidature.TypeTechnologie.ValueType;
  cahierDesCharges: Option.Type<Lauréat.ConsulterCahierDesChargesChoisiReadModel>;
  note: number;
};

export async function demanderChangement(
  this: PuissanceAggregate,
  {
    identifiantUtilisateur,
    nouvellePuissance,
    puissanceInitiale,
    dateDemande,
    identifiantProjet,
    pièceJustificative,
    raison,
    estAbandonné,
    demandeAbandonEnCours,
    estAchevé,
    appelOffre,
    technologie,
    cahierDesCharges,
    note,
  }: DemanderOptions,
) {
  if (this.puissance === nouvellePuissance) {
    throw new PuissanceIdentiqueError();
  }

  if (nouvellePuissance <= 0) {
    throw new PuissanceNulleOuNégativeError();
  }

  if (this.demande) {
    this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementPuissance.demandé,
    );
  }

  if (estAbandonné) {
    throw new ProjetAbandonnéError();
  }

  if (demandeAbandonEnCours) {
    throw new ProjetAvecDemandeAbandonEnCoursError();
  }

  if (estAchevé) {
    throw new ProjetAchevéError();
  }

  if (Option.isNone(cahierDesCharges)) {
    throw new CahierDesChargesInexistantError();
  }

  if (Option.isNone(appelOffre)) {
    throw new AppelOffreInexistantError(identifiantProjet.appelOffre);
  }

  const période = appelOffre.periodes.find((p) => p.id === identifiantProjet.période);
  if (!période) {
    throw new PériodeInexistanteError(identifiantProjet.période);
  }
  const famille = période.familles.find((f) => f.id === identifiantProjet.famille);

  const ratio = nouvellePuissance / puissanceInitiale;

  RatioChangementPuissance.bind({
    appelOffre,
    période,
    famille,
    cahierDesCharges,
    ratio,
    technologie: technologie.type,
    nouvellePuissance,
    note,
  }).vérifierQueLaDemandeEstPossible('demande');

  const event: ChangementPuissanceDemandéEvent = {
    type: 'ChangementPuissanceDemandé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      puissance: nouvellePuissance,
      autoritéCompétente: AutoritéCompétente.déterminer(ratio).autoritéCompétente,
      pièceJustificative: {
        format: pièceJustificative.format,
      },
      raison,
      demandéLe: dateDemande.formatter(),
      demandéPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyChangementPuissanceDemandé(
  this: PuissanceAggregate,
  { payload: { puissance, autoritéCompétente } }: ChangementPuissanceDemandéEvent,
) {
  this.demande = {
    statut: StatutChangementPuissance.demandé,
    nouvellePuissance: puissance,
    autoritéCompétente,
  };
}
