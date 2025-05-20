import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Candidature } from '@potentiel-domain/projet';

import { ActionnaireAggregate } from '../../actionnaire.aggregate';
import {
  ActionnaireNePeutPasÊtreModifiéDirectement,
  ProjetAbandonnéError,
  ProjetAvecDemandeAbandonEnCoursError,
  ProjetAchevéError,
} from '../../errors';
import { StatutChangementActionnaire, InstructionChangementActionnaire } from '../..';

export type ChangementActionnaireEnregistréEvent = DomainEvent<
  'ChangementActionnaireEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

export type EnregistrerChangementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  actionnaire: string;
  dateChangement: DateTime.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
  estAbandonné: boolean;
  estAchevé: boolean;
  demandeAbandonEnCours: boolean;
  typeActionnariat?: Candidature.TypeActionnariat.ValueType;
  aDesGarantiesFinancièresConstituées: boolean;
  aUnDépotEnCours: boolean;
};

export async function enregistrerChangement(
  this: ActionnaireAggregate,
  {
    identifiantProjet,
    actionnaire,
    dateChangement,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
    estAbandonné,
    estAchevé,
    demandeAbandonEnCours,
    typeActionnariat,
    aUnDépotEnCours,
    aDesGarantiesFinancièresConstituées,
  }: EnregistrerChangementOptions,
) {
  const instructionChangementActionnaire = InstructionChangementActionnaire.bind({
    appelOffre: identifiantProjet.appelOffre,
    typeActionnariat,
    aUnDépotEnCours,
    aDesGarantiesFinancièresConstituées,
  });

  if (instructionChangementActionnaire.estRequise()) {
    throw new ActionnaireNePeutPasÊtreModifiéDirectement();
  }

  if (this.demande) {
    this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementActionnaire.informationEnregistrée,
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

  const event: ChangementActionnaireEnregistréEvent = {
    type: 'ChangementActionnaireEnregistré-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      actionnaire,
      enregistréLe: dateChangement.formatter(),
      enregistréPar: identifiantUtilisateur.formatter(),
      raison,
      pièceJustificative: {
        format: pièceJustificative.format,
      },
    },
  };

  await this.publish(event);
}

export function applyChangementActionnaireEnregistré(
  this: ActionnaireAggregate,
  { payload: { actionnaire } }: ChangementActionnaireEnregistréEvent,
) {
  this.actionnaire = actionnaire;
}
