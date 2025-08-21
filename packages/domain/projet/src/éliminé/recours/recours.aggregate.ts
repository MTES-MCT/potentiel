import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { Email } from '@potentiel-domain/common';

import { ÉliminéAggregate } from '../éliminé.aggregate';
import { GarantiesFinancières } from '../../lauréat';

import { RecoursEvent } from './recours.event';
import { AccorderOptions } from './accorder/recoursAccordé.options';
import * as StatutRecours from './statutRecours.valueType';
import { RecoursAccordéEvent } from './accorder/recoursAccordé.event';
import { AnnulerOptions } from './annuler/annulerRecours.options';
import { RecoursAnnuléEvent } from './annuler/annulerRecours.event';
import { DemanderOptions } from './demander/demanderRecours.options';
import { RecoursDemandéEvent } from './demander/demanderRecours.event';
import { RejeterOptions } from './rejeter/rejeterRecours.options';
import { RecoursRejetéEvent } from './rejeter/rejeterRecours.event';
import { InstruireOptions } from './instruire/passerRecoursEnInstruction.options';
import { RecoursPasséEnInstructionEvent } from './instruire/passerRecoursEnInstruction.event';
import {
  AucunRecoursEnCours,
  RecoursDéjàEnInstructionAvecLeMêmeAdministrateurError,
} from './recours.error';

export class RecoursAggregate extends AbstractAggregate<RecoursEvent, 'recours', ÉliminéAggregate> {
  statut = StatutRecours.inconnu;

  instruction?: {
    instruitPar: Email.ValueType;
  };

  get éliminé() {
    return this.parent;
  }

  async accorder({ dateAccord, identifiantUtilisateur, réponseSignée }: AccorderOptions) {
    this.assertExists();

    this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutRecours.accordé);

    const event: RecoursAccordéEvent = {
      type: 'RecoursAccordé-V1',
      payload: {
        identifiantProjet: this.éliminé.projet.identifiantProjet.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
        accordéLe: dateAccord.formatter(),
        accordéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);

    await this.éliminé.projet.lauréat.notifier({
      attestation: { format: réponseSignée.format },
      importerGarantiesFinancières: false,
    });

    await this.éliminé.projet.lauréat.garantiesFinancières.demander({
      demandéLe: dateAccord,
      motif: GarantiesFinancières.MotifDemandeGarantiesFinancières.recoursAccordé,
      dateLimiteSoumission: dateAccord.ajouterNombreDeMois(2),
    });
  }

  async annuler({ dateAnnulation, identifiantUtilisateur }: AnnulerOptions) {
    this.assertExists();

    this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutRecours.annulé);

    const event: RecoursAnnuléEvent = {
      type: 'RecoursAnnulé-V1',
      payload: {
        identifiantProjet: this.éliminé.projet.identifiantProjet.formatter(),
        annuléLe: dateAnnulation.formatter(),
        annuléPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  async demander({
    identifiantUtilisateur,
    dateDemande,
    pièceJustificative,
    raison,
  }: DemanderOptions) {
    this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutRecours.demandé);
    this.éliminé.projet.cahierDesChargesActuel.vérifierQueLeChangementEstPossible(
      'demande',
      'recours',
    );

    const event: RecoursDemandéEvent = {
      type: 'RecoursDemandé-V1',
      payload: {
        identifiantProjet: this.éliminé.projet.identifiantProjet.formatter(),
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

  async rejeter({ identifiantUtilisateur, dateRejet, réponseSignée }: RejeterOptions) {
    this.assertExists();

    this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutRecours.rejeté);

    const event: RecoursRejetéEvent = {
      type: 'RecoursRejeté-V1',
      payload: {
        identifiantProjet: this.éliminé.projet.identifiantProjet.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
        rejetéLe: dateRejet.formatter(),
        rejetéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  async passerEnInstruction({ dateInstruction, identifiantUtilisateur }: InstruireOptions) {
    this.assertExists();

    this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutRecours.enInstruction);

    if (this.instruction?.instruitPar.estÉgaleÀ(identifiantUtilisateur)) {
      throw new RecoursDéjàEnInstructionAvecLeMêmeAdministrateurError();
    }

    const event: RecoursPasséEnInstructionEvent = {
      type: 'RecoursPasséEnInstruction-V1',
      payload: {
        identifiantProjet: this.éliminé.projet.identifiantProjet.formatter(),
        passéEnInstructionLe: dateInstruction.formatter(),
        passéEnInstructionPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  apply(event: RecoursEvent): void {
    match(event)
      .with(
        {
          type: 'RecoursAccordé-V1',
        },
        (event) => this.applyRecoursAccordéV1(event),
      )
      .with(
        {
          type: 'RecoursAnnulé-V1',
        },
        (event) => this.applyRecoursAnnuléV1(event),
      )
      .with(
        {
          type: 'RecoursDemandé-V1',
        },
        (event) => this.applyRecoursDemandéV1(event),
      )
      .with(
        {
          type: 'RecoursRejeté-V1',
        },
        (event) => this.applyRecoursRejetéV1(event),
      )
      .with(
        {
          type: 'RecoursPasséEnInstruction-V1',
        },
        (event) => this.applyRecoursPasséEnInstructionV1(event),
      )
      .exhaustive();
  }

  private applyRecoursAccordéV1(_: RecoursAccordéEvent) {
    this.statut = StatutRecours.accordé;
    this.instruction = undefined;
  }

  private applyRecoursAnnuléV1(_: RecoursAnnuléEvent) {
    this.statut = StatutRecours.annulé;
    this.instruction = undefined;
  }

  private applyRecoursDemandéV1(_: RecoursDemandéEvent) {
    this.statut = StatutRecours.demandé;
  }

  private applyRecoursRejetéV1(_: RecoursRejetéEvent) {
    this.statut = StatutRecours.rejeté;
    this.instruction = undefined;
  }

  private applyRecoursPasséEnInstructionV1({
    payload: { passéEnInstructionPar },
  }: RecoursPasséEnInstructionEvent) {
    this.statut = StatutRecours.enInstruction;
    this.instruction = {
      instruitPar: Email.convertirEnValueType(passéEnInstructionPar),
    };
  }

  private assertExists() {
    if (!this.exists) {
      throw new AucunRecoursEnCours();
    }
  }
}
