import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { ProducteurAggregate } from '../../producteur.aggregate';
import {
  ProjetAbandonnéError,
  ProjetAvecDemandeAbandonEnCoursError,
  ProjetAchevéError,
  AppelOffreInexistantError,
  AOEmpêcheChangementProducteurError,
  ProducteurIdentiqueError,
} from '../errors';

export type ChangementProducteurEnregistréEvent = DomainEvent<
  'ChangementProducteurEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    producteur: string;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison?: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

export type EnregistrerChangementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  producteur: string;
  dateChangement: DateTime.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison?: string;
  estAbandonné: boolean;
  estAchevé: boolean;
  demandeAbandonEnCours: boolean;
  appelOffre: Option.Type<AppelOffre.ConsulterAppelOffreReadModel>;
};

export async function enregistrerChangement(
  this: ProducteurAggregate,
  {
    identifiantProjet,
    producteur,
    dateChangement,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
    estAbandonné,
    estAchevé,
    demandeAbandonEnCours,
    appelOffre,
  }: EnregistrerChangementOptions,
) {
  if (this.producteur === producteur) {
    throw new ProducteurIdentiqueError();
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

  if (Option.isNone(appelOffre)) {
    throw new AppelOffreInexistantError(identifiantProjet.appelOffre);
  }

  if (!appelOffre.changementProducteurPossibleAvantAchèvement) {
    throw new AOEmpêcheChangementProducteurError();
  }

  const event: ChangementProducteurEnregistréEvent = {
    type: 'ChangementProducteurEnregistré-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      producteur,
      enregistréLe: dateChangement.formatter(),
      enregistréPar: identifiantUtilisateur.formatter(),
      raison,
      pièceJustificative,
    },
  };

  await this.publish(event);
}

export function applyChangementProducteurEnregistré(
  this: ProducteurAggregate,
  { payload: { producteur } }: ChangementProducteurEnregistréEvent,
) {
  this.producteur = producteur;
}
