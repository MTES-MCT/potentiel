import { match } from 'ts-pattern';

import { AbstractAggregate, AggregateType } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate';
import { IdentifiantProjet, Lauréat } from '../..';
import { TâcheAggregate } from '../tâche/tâche.aggregate';
import { TypeTâche } from '../tâche';

import {
  AbandonConfirméEvent,
  AutoritéCompétente,
  ConfirmationAbandonDemandéeEvent,
  PreuveRecandidatureDemandéeEvent,
  PreuveRecandidatureTransmiseEvent,
  StatutAbandon,
} from '.';

import { AbandonEvent } from './abandon.event';
import { AbandonDemandéEvent, AbandonDemandéEventV1 } from './demander/demanderAbandon.event';
import { AbandonAccordéEvent } from './accorder/accorderAbandon.event';
import { AbandonRejetéEvent } from './rejeter/rejeterAbandon.event';
import { AbandonAnnuléEvent } from './annuler/annulerAbandon.event';
import { DemanderOptions } from './demander/demanderAbandon.option';
import {
  AbandonDéjàEnInstructionAvecLeMêmeAdministrateurError,
  AbandonPasDansUnContexteDeRecandidatureError,
  AucunAbandonEnCours,
  DateLégaleTransmissionPreuveRecandidatureDépasséeError,
  DemandePreuveRecandidautreDéjàTransmise,
  PièceJustificativeObligatoireError,
  PreuveRecandidautreDéjàTransmise,
  ProjetNonNotifiéError,
  ProjetNotifiéAprèsLaDateMaximumError,
  ProjetNotifiéAvantLaDateMinimumError,
  TranmissionPreuveRecandidatureImpossibleError,
} from './abandon.error';
import { AccorderOptions } from './accorder/accorderAbandon.option';
import { AbandonPasséEnInstructionEvent } from './instruire/instruireAbandon.event';
import { DemanderPreuveRecandidatureOptions } from './demanderPreuveRecandidature/demanderPreuveRecandidature.option';
import { dateLégaleMaxTransimissionPreuveRecandidature } from './abandon.constant';
import { TransmettrePreuveRecandidatureOptions } from './transmettrePreuveRecandidature/transmettrePreuveRecandidature.option';
import { DemanderConfirmationOptions } from './demanderConfirmation/demanderConfirmation.option';
import { ConfirmerOptions } from './confirmer/confirmerAbandon.option';
import { InstruireOptions } from './instruire/instruireAbandon.option';
import { AnnulerOptions } from './annuler/annulerAbandon.option';
import { RejeterOptions } from './rejeter/rejeterAbandon.option';

export class AbandonAggregate extends AbstractAggregate<AbandonEvent, 'abandon', LauréatAggregate> {
  #statut: StatutAbandon.ValueType = StatutAbandon.inconnu;
  #demande?: {
    recandidature: boolean;
    preuveRecandidature?: IdentifiantProjet.ValueType;

    instruction?: {
      instruitPar: Email.ValueType;
    };
  };

  #tâcheConfirmerAbandon!: AggregateType<TâcheAggregate>;
  #tâcheTransmettrePreuveRecandidature!: AggregateType<TâcheAggregate>;

  async init() {
    this.#tâcheConfirmerAbandon = await this.lauréat.loadTâche(TypeTâche.abandonConfirmer.type);
    this.#tâcheTransmettrePreuveRecandidature = await this.lauréat.loadTâche(
      TypeTâche.abandonTransmettrePreuveRecandidature.type,
    );
  }

  get autoritéCompétente(): AutoritéCompétente.ValueType {
    return AutoritéCompétente.convertirEnValueType(
      this.lauréat.projet.cahierDesChargesActuel.getAutoritéCompétente('abandon'),
    );
  }

  get statut() {
    return this.#statut;
  }

  get lauréat() {
    return this.parent;
  }

  async demander({
    identifiantUtilisateur,
    dateDemande,
    pièceJustificative,
    raison,
  }: DemanderOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();
    this.lauréat.vérifierNonAchevé();
    this.lauréat.projet.cahierDesChargesActuel.vérifierQueLeChangementEstPossible(
      'demande',
      'abandon',
    );

    this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.demandé);

    if (!pièceJustificative) {
      throw new PièceJustificativeObligatoireError();
    }

    const event: AbandonDemandéEvent = {
      type: 'AbandonDemandé-V2',
      payload: {
        identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
        pièceJustificative: pièceJustificative && {
          format: pièceJustificative.format,
        },
        raison,
        demandéLe: dateDemande.formatter(),
        demandéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
    // annuler tâche planifiée relance achèvement
  }

  async accorder({
    dateAccord,
    identifiantUtilisateur,
    réponseSignée,
    rôleUtilisateur,
  }: AccorderOptions) {
    this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.accordé);
    this.autoritéCompétente.peutInstruire(rôleUtilisateur);

    const event: AbandonAccordéEvent = {
      type: 'AbandonAccordé-V1',
      payload: {
        identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
        accordéLe: dateAccord.formatter(),
        accordéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);

    // TODO: Il faut attendre un peu ici car sinon l'exécution des projecteurs risque se faire en même temps
    // et générer des projections avec des données erronées
    // Idéalement il ne faudrait pas avoir des projecteur qui s'exécute en parallèle
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (this.#demande?.recandidature) {
      await this.demanderPreuveRecandidature({
        dateDemande: dateAccord,
      });
    }

    await this.supprimerDemandeChangement({
      dateSuppression: dateAccord,
      identifiantUtilisateur,
    });

    await this.lauréat.raccordement.supprimerRaccordement();
    await this.lauréat.garantiesFinancières.annulerTâchesPlanififées();
  }

  async demanderPreuveRecandidature({ dateDemande }: DemanderPreuveRecandidatureOptions) {
    if (!this.#demande) {
      throw new AucunAbandonEnCours();
    }
    if (dateDemande.estUltérieureÀ(dateLégaleMaxTransimissionPreuveRecandidature)) {
      throw new DateLégaleTransmissionPreuveRecandidatureDépasséeError();
    }

    if (this.#demande?.preuveRecandidature) {
      throw new DemandePreuveRecandidautreDéjàTransmise();
    }

    const event: PreuveRecandidatureDemandéeEvent = {
      type: 'PreuveRecandidatureDemandée-V1',
      payload: {
        identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
        demandéeLe: dateDemande.formatter(),
      },
    };

    await this.publish(event);

    await this.#tâcheTransmettrePreuveRecandidature.ajouter();
  }

  async transmettrePreuveRecandidature({
    preuveRecandidature,
    identifiantUtilisateur,
    dateTransmissionPreuveRecandidature,
  }: TransmettrePreuveRecandidatureOptions) {
    preuveRecandidature.candidature.vérifierQueLaCandidatureExiste();

    if (!this.#demande?.recandidature) {
      throw new AbandonPasDansUnContexteDeRecandidatureError();
    }

    if (this.#demande?.preuveRecandidature) {
      throw new PreuveRecandidautreDéjàTransmise();
    }

    if (!this.statut.estAccordé()) {
      throw new TranmissionPreuveRecandidatureImpossibleError();
    }

    if (!preuveRecandidature.candidature.estNotifiée) {
      throw new ProjetNonNotifiéError();
    }

    if (
      preuveRecandidature.candidature.notifiéeLe.estAntérieurÀ(
        DateTime.convertirEnValueType(new Date('2023-12-15')),
      )
    ) {
      throw new ProjetNotifiéAvantLaDateMinimumError();
    }

    if (
      preuveRecandidature.candidature.notifiéeLe.estUltérieureÀ(
        DateTime.convertirEnValueType(new Date('2025-03-31')),
      )
    ) {
      throw new ProjetNotifiéAprèsLaDateMaximumError();
    }

    const event: Lauréat.Abandon.PreuveRecandidatureTransmiseEvent = {
      type: 'PreuveRecandidatureTransmise-V1',
      payload: {
        identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
        preuveRecandidature: preuveRecandidature.identifiantProjet.formatter(),
        transmisePar: identifiantUtilisateur.formatter(),
        transmiseLe: dateTransmissionPreuveRecandidature.formatter(),
      },
    };

    await this.publish(event);

    await this.#tâcheTransmettrePreuveRecandidature.achever();
  }

  async demanderConfirmation({
    dateDemande,
    identifiantUtilisateur,
    réponseSignée,
    rôleUtilisateur,
  }: DemanderConfirmationOptions) {
    this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      Lauréat.Abandon.StatutAbandon.confirmationDemandée,
    );
    this.autoritéCompétente.peutInstruire(rôleUtilisateur);

    const event: Lauréat.Abandon.ConfirmationAbandonDemandéeEvent = {
      type: 'ConfirmationAbandonDemandée-V1',
      payload: {
        identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
        confirmationDemandéeLe: dateDemande.formatter(),
        confirmationDemandéePar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);

    await this.#tâcheConfirmerAbandon.ajouter();
  }

  async confirmer({ dateConfirmation, identifiantUtilisateur }: ConfirmerOptions) {
    this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      Lauréat.Abandon.StatutAbandon.confirmé,
    );

    const event: Lauréat.Abandon.AbandonConfirméEvent = {
      type: 'AbandonConfirmé-V1',
      payload: {
        identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
        confirméLe: dateConfirmation.formatter(),
        confirméPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);

    await this.#tâcheConfirmerAbandon.achever();
  }

  async passerEnInstruction({
    dateInstruction,
    identifiantUtilisateur,
    rôleUtilisateur,
  }: InstruireOptions) {
    this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      Lauréat.Abandon.StatutAbandon.enInstruction,
    );
    this.autoritéCompétente.peutInstruire(rôleUtilisateur);

    if (this.#demande?.instruction?.instruitPar.estÉgaleÀ(identifiantUtilisateur)) {
      throw new AbandonDéjàEnInstructionAvecLeMêmeAdministrateurError();
    }

    const event: Lauréat.Abandon.AbandonPasséEnInstructionEvent = {
      type: 'AbandonPasséEnInstruction-V1',
      payload: {
        identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
        passéEnInstructionLe: dateInstruction.formatter(),
        passéEnInstructionPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  async annuler({ dateAnnulation, identifiantUtilisateur }: AnnulerOptions) {
    this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(Lauréat.Abandon.StatutAbandon.annulé);

    const event: Lauréat.Abandon.AbandonAnnuléEvent = {
      type: 'AbandonAnnulé-V1',
      payload: {
        identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
        annuléLe: dateAnnulation.formatter(),
        annuléPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
    // si AOS, créer tâche planifier relance achèvement
  }

  async rejeter({
    identifiantUtilisateur,
    dateRejet,
    réponseSignée,
    rôleUtilisateur,
  }: RejeterOptions) {
    this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(Lauréat.Abandon.StatutAbandon.rejeté);
    this.autoritéCompétente.peutInstruire(rôleUtilisateur);

    const event: Lauréat.Abandon.AbandonRejetéEvent = {
      type: 'AbandonRejeté-V1',
      payload: {
        identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
        rejetéLe: dateRejet.formatter(),
        rejetéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
    // si AOS, créer tâche planifier relance achèvement
  }

  async supprimerDemandeChangement({
    dateSuppression,
    identifiantUtilisateur,
  }: {
    dateSuppression: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
  }) {
    await this.lauréat.puissance.supprimerDemandeChangement({
      dateSuppression,
      identifiantUtilisateur,
    });

    await this.lauréat.actionnaire.supprimerDemandeChangement({
      dateSuppression,
      identifiantUtilisateur,
    });

    await this.lauréat.représentantLégal.supprimerDemandeChangement({
      dateSuppression,
      identifiantUtilisateur,
    });

    await this.lauréat.délai.supprimerDemandeDélai({
      dateSuppression,
      identifiantUtilisateur,
    });
  }

  apply(event: AbandonEvent): void {
    match(event)
      .with({ type: 'AbandonDemandé-V1' }, this.applyAbandonDemandéV1.bind(this))
      .with({ type: 'AbandonDemandé-V2' }, this.applyAbandonDemandéV2.bind(this))
      .with({ type: 'AbandonAccordé-V1' }, this.applyAbandonAccordéV1.bind(this))
      .with({ type: 'AbandonRejeté-V1' }, this.applyAbandonRejetéV1.bind(this))
      .with({ type: 'AbandonAnnulé-V1' }, this.applyAbandonAnnuléV1.bind(this))
      .with(
        { type: 'AbandonPasséEnInstruction-V1' },
        this.applyAbandonPasséEnInstructionV1.bind(this),
      )
      .with(
        { type: 'PreuveRecandidatureDemandée-V1' },
        this.applyPreuveRecandidatureDemandéeV1.bind(this),
      )
      .with(
        { type: 'PreuveRecandidatureTransmise-V1' },
        this.applyPreuveRecandidatureTransmiseV1.bind(this),
      )
      .with(
        {
          type: 'ConfirmationAbandonDemandée-V1',
        },
        this.applyConfirmationAbandonDemandéeV1.bind(this),
      )
      .with({ type: 'AbandonConfirmé-V1' }, this.applyAbandonConfirméEventV1.bind(this))
      .exhaustive();
  }

  private applyAbandonDemandéV1({ payload: { recandidature } }: AbandonDemandéEventV1) {
    this.#statut = StatutAbandon.demandé;
    this.#demande = {
      recandidature,
    };
  }

  private applyAbandonDemandéV2(_: AbandonDemandéEvent) {
    this.#statut = StatutAbandon.demandé;
    this.#demande = {
      recandidature: false,
    };
  }

  private applyAbandonAccordéV1(_event: AbandonAccordéEvent) {
    this.#statut = StatutAbandon.accordé;
  }

  private applyAbandonRejetéV1(_event: AbandonRejetéEvent) {
    this.#statut = StatutAbandon.rejeté;
  }

  private applyAbandonAnnuléV1(_event: AbandonAnnuléEvent) {
    this.#statut = StatutAbandon.annulé;
  }
  private applyAbandonPasséEnInstructionV1({
    payload: { passéEnInstructionPar },
  }: AbandonPasséEnInstructionEvent) {
    this.#statut = StatutAbandon.enInstruction;
    if (this.#demande) {
      this.#demande.instruction = {
        instruitPar: Email.convertirEnValueType(passéEnInstructionPar),
      };
    }
  }
  private applyPreuveRecandidatureDemandéeV1(_event: PreuveRecandidatureDemandéeEvent) {}

  private applyPreuveRecandidatureTransmiseV1({
    payload: { preuveRecandidature },
  }: PreuveRecandidatureTransmiseEvent) {
    if (this.#demande) {
      this.#demande.preuveRecandidature =
        IdentifiantProjet.convertirEnValueType(preuveRecandidature);
    }
  }

  private applyConfirmationAbandonDemandéeV1(_: ConfirmationAbandonDemandéeEvent) {
    this.#statut = StatutAbandon.confirmationDemandée;
  }

  private applyAbandonConfirméEventV1(_: AbandonConfirméEvent) {
    this.#statut = StatutAbandon.confirmé;
  }
}
