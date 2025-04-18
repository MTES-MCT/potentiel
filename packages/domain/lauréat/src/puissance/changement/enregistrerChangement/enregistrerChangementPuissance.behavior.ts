import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { PuissanceAggregate } from '../../puissance.aggregate';
import { RatioChangementPuissance, StatutChangementPuissance } from '../..';
import {
  ProjetAbandonnéError,
  ProjetAvecDemandeAbandonEnCoursError,
  ProjetAchevéError,
  AppelOffreInexistantError,
  CahierDesChargesInexistantError,
  PériodeInexistanteError,
} from '../errors';
import { PuissanceIdentiqueError } from '../../errors';
import { ConsulterCahierDesChargesChoisiReadmodel } from '../../../cahierDesChargesChoisi';

export type ChangementPuissanceEnregistréEvent = DomainEvent<
  'ChangementPuissanceEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison?: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;

export type EnregistrerChangementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  nouvellePuissance: number;
  puissanceInitiale: number;
  dateChangement: DateTime.ValueType;
  pièceJustificative?: DocumentProjet.ValueType;
  raison?: string;
  estAbandonné: boolean;
  estAchevé: boolean;
  demandeAbandonEnCours: boolean;
  appelOffre: Option.Type<AppelOffre.ConsulterAppelOffreReadModel>;
  technologie: Candidature.TypeTechnologie.ValueType;
  cahierDesCharges: Option.Type<ConsulterCahierDesChargesChoisiReadmodel>;
  note: number;
};

export async function enregistrerChangement(
  this: PuissanceAggregate,
  {
    identifiantProjet,
    nouvellePuissance,
    puissanceInitiale,
    dateChangement,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
    estAbandonné,
    estAchevé,
    demandeAbandonEnCours,
    appelOffre,
    technologie,
    cahierDesCharges,
    note,
  }: EnregistrerChangementOptions,
) {
  if (this.puissance === nouvellePuissance) {
    throw new PuissanceIdentiqueError();
  }

  if (this.demande) {
    this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementPuissance.informationEnregistrée,
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

  RatioChangementPuissance.bind({
    appelOffre,
    période,
    famille,
    cahierDesCharges,
    technologie: technologie.type,
    ratio: nouvellePuissance / puissanceInitiale,
    nouvellePuissance,
    note,
  }).vérifierQueLaDemandeEstPossible('information-enregistrée');

  const event: ChangementPuissanceEnregistréEvent = {
    type: 'ChangementPuissanceEnregistré-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      puissance: nouvellePuissance,
      enregistréLe: dateChangement.formatter(),
      enregistréPar: identifiantUtilisateur.formatter(),
      raison,
      pièceJustificative: pièceJustificative ?? undefined,
    },
  };

  await this.publish(event);
}

export function applyChangementPuissanceEnregistré(
  this: PuissanceAggregate,
  { payload: { puissance } }: ChangementPuissanceEnregistréEvent,
) {
  this.puissance = puissance;
}
