import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';
import { VolumeRéservé } from '../../candidature';

import { AutoritéCompétente, RatioChangementPuissance, StatutChangementPuissance } from '.';

import { PuissanceImportéeEvent } from './importer/importerPuissance.event';
import { ImporterOptions } from './importer/importerPuissance.options';
import { PuissanceModifiéeEvent } from './modifier/modifierPuissance.event';
import { ModifierOptions } from './modifier/modifierPuissance.options';
import { ChangementPuissanceDemandéEvent } from './changement/demander/demanderChangementPuissance.event';
import { DemanderOptions } from './changement/demander/demanderChangementPuissance.options';
import { ChangementPuissanceAnnuléEvent } from './changement/annuler/annulerChangementPuissance.event';
import { AnnulerOptions } from './changement/annuler/annulerChangementPuissance.options';
import { ChangementPuissanceSuppriméEvent } from './changement/supprimer/supprimerChangementPuissance.event';
import { SupprimerChangementPuissanceOptions } from './changement/supprimer/supprimerChangementPuissance.options';
import { ChangementPuissanceAccordéEvent } from './changement/accorder/accorderChangementPuissance.event';
import { AccorderChangementPuissanceOptions } from './changement/accorder/accorderChangementPuissance.options';
import { ChangementPuissanceEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementPuissance.event';
import { EnregistrerChangementOptions } from './changement/enregistrerChangement/enregistrerChangementPuissance.options';
import {
  DemandeDeChangementPuissanceEnCoursError,
  PuissanceDéjàImportéeError,
  PuissanceIdentiqueError,
  PuissanceNulleOuNégativeError,
} from './puissance.error';
import { ChangementPuissanceRejetéEvent } from './changement/rejeter/rejeterChangementPuissance.event';
import { RejeterChangementPuissanceOptions } from './changement/rejeter/rejeterChangementPuissance.options';
import { PuissanceEvent } from './puissance.event';
import {
  DemandeDeChangementInexistanteError,
  DemandeDoitÊtreInstruiteParDGECError,
  RéponseSignéeObligatoireSiAccordSansDécisionDeLEtatError,
} from './changement/errors';

export class PuissanceAggregate extends AbstractAggregate<PuissanceEvent, LauréatAggregate> {
  #puissance!: number;

  #demande?: {
    statut: StatutChangementPuissance.ValueType;
    nouvellePuissance: number;
    autoritéCompétente?: AutoritéCompétente.RawType;
  };

  get lauréat() {
    return this.parent;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async importer({ puissance, importéeLe }: ImporterOptions) {
    if (this.#puissance) {
      throw new PuissanceDéjàImportéeError();
    }

    const event: PuissanceImportéeEvent = {
      type: 'PuissanceImportée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        puissance,
        importéeLe: importéeLe.formatter(),
      },
    };

    await this.publish(event);
  }

  async modifier({ puissance, dateModification, identifiantUtilisateur, raison }: ModifierOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    if (this.#puissance === puissance) {
      throw new PuissanceIdentiqueError();
    }

    if (puissance <= 0) {
      throw new PuissanceNulleOuNégativeError();
    }

    if (this.#demande?.statut.estDemandé()) {
      throw new DemandeDeChangementPuissanceEnCoursError();
    }

    const event: PuissanceModifiéeEvent = {
      type: 'PuissanceModifiée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        puissance,
        modifiéeLe: dateModification.formatter(),
        modifiéePar: identifiantUtilisateur.formatter(),
        raison,
      },
    };

    await this.publish(event);
  }

  async enregistrerChangement({
    nouvellePuissance,
    dateChangement,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
  }: EnregistrerChangementOptions) {
    this.vérifierChangementPossible('information-enregistrée', nouvellePuissance);

    if (this.#puissance === nouvellePuissance) {
      throw new PuissanceIdentiqueError();
    }

    if (this.#demande) {
      this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
        StatutChangementPuissance.informationEnregistrée,
      );
    }

    const event: ChangementPuissanceEnregistréEvent = {
      type: 'ChangementPuissanceEnregistré-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        puissance: nouvellePuissance,
        enregistréLe: dateChangement.formatter(),
        enregistréPar: identifiantUtilisateur.formatter(),
        raison,
        pièceJustificative: pièceJustificative ?? undefined,
      },
    };

    await this.publish(event);
  }

  async demanderChangement({
    identifiantUtilisateur,
    nouvellePuissance,
    dateDemande,
    pièceJustificative,
    raison,
  }: DemanderOptions) {
    this.vérifierChangementPossible('demande', nouvellePuissance);

    if (this.#puissance === nouvellePuissance) {
      throw new PuissanceIdentiqueError();
    }

    if (nouvellePuissance <= 0) {
      throw new PuissanceNulleOuNégativeError();
    }

    if (this.#demande) {
      this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
        StatutChangementPuissance.demandé,
      );
    }

    const ratio = nouvellePuissance / this.lauréat.projet.candidature.puissanceProductionAnnuelle;

    const event: ChangementPuissanceDemandéEvent = {
      type: 'ChangementPuissanceDemandé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
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

  async annulerDemandeChangement({ dateAnnulation, identifiantUtilisateur }: AnnulerOptions) {
    if (!this.#demande) {
      throw new DemandeDeChangementInexistanteError();
    }

    this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementPuissance.annulé,
    );

    const event: ChangementPuissanceAnnuléEvent = {
      type: 'ChangementPuissanceAnnulé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        annuléLe: dateAnnulation.formatter(),
        annuléPar: identifiantUtilisateur.formatter(),
        autoritéCompétente: this.#demande.autoritéCompétente,
      },
    };

    await this.publish(event);
  }

  async accorderDemandeChangement({
    accordéLe,
    accordéPar,
    réponseSignée,
    rôleUtilisateur,
    estUneDécisionDEtat,
  }: AccorderChangementPuissanceOptions) {
    if (!this.#demande) {
      throw new DemandeDeChangementInexistanteError();
    }

    this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementPuissance.accordé,
    );

    if (this.#demande.autoritéCompétente === 'dgec-admin' && rôleUtilisateur.nom === 'dreal') {
      throw new DemandeDoitÊtreInstruiteParDGECError();
    }

    if (!estUneDécisionDEtat && !réponseSignée) {
      throw new RéponseSignéeObligatoireSiAccordSansDécisionDeLEtatError();
    }

    const event: ChangementPuissanceAccordéEvent = {
      type: 'ChangementPuissanceAccordé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        accordéLe: accordéLe.formatter(),
        accordéPar: accordéPar.formatter(),
        réponseSignée: réponseSignée && {
          format: réponseSignée.format,
        },
        nouvellePuissance: this.#demande.nouvellePuissance,
        estUneDécisionDEtat: estUneDécisionDEtat ? true : undefined,
      },
    };

    await this.publish(event);
  }

  async rejeterDemandeChangement({
    rejetéLe,
    rejetéPar,
    réponseSignée,
    rôleUtilisateur,
    estUneDécisionDEtat,
  }: RejeterChangementPuissanceOptions) {
    if (!this.#demande) {
      throw new DemandeDeChangementInexistanteError();
    }

    this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementPuissance.rejeté,
    );

    if (this.#demande.autoritéCompétente === 'dgec-admin' && !rôleUtilisateur.estDGEC()) {
      throw new DemandeDoitÊtreInstruiteParDGECError();
    }

    const event: ChangementPuissanceRejetéEvent = {
      type: 'ChangementPuissanceRejeté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        rejetéLe: rejetéLe.formatter(),
        rejetéPar: rejetéPar.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
        estUneDécisionDEtat: estUneDécisionDEtat ? true : undefined,
      },
    };

    await this.publish(event);
  }

  async supprimerDemandeChangement({
    identifiantUtilisateur,
    dateSuppression,
  }: SupprimerChangementPuissanceOptions) {
    if (!this.#demande) {
      return;
    }

    const event: ChangementPuissanceSuppriméEvent = {
      type: 'ChangementPuissanceSupprimé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        suppriméLe: dateSuppression.formatter(),
        suppriméPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  private vérifierChangementPossible(
    type: 'demande' | 'information-enregistrée',
    nouvellePuissance: number,
  ) {
    this.lauréat.vérifierQueLeChangementEstPossible();

    const {
      noteTotale: note,
      puissanceProductionAnnuelle: puissanceInitiale,
      technologie,
    } = this.lauréat.projet.candidature;

    RatioChangementPuissance.déterminer({
      appelOffre: this.lauréat.projet.appelOffre,
      famille: this.lauréat.projet.famille,
      cahierDesCharges: this.lauréat.cahierDesCharges,
      technologie,
      puissanceInitiale,
      nouvellePuissance,
      volumeRéservé: VolumeRéservé.déterminer({
        note,
        période: this.lauréat.projet.période,
        puissanceInitiale,
      }),
    }).vérifierQueLaDemandeEstPossible(type);
  }

  apply(event: PuissanceEvent) {
    match(event)
      .with({ type: 'PuissanceImportée-V1' }, this.applyPuissanceImportée.bind(this))
      .with({ type: 'PuissanceModifiée-V1' }, this.applyPuissanceModifiée.bind(this))
      .with(
        { type: 'ChangementPuissanceEnregistré-V1' },
        this.applyChangementPuissanceEnregistré.bind(this),
      )
      .with(
        { type: 'ChangementPuissanceDemandé-V1' },
        this.applyChangementPuissanceDemandé.bind(this),
      )
      .with(
        { type: 'ChangementPuissanceAnnulé-V1' },
        this.applyChangementPuissanceAnnulé.bind(this),
      )
      .with(
        { type: 'ChangementPuissanceSupprimé-V1' },
        this.applyChangementPuissanceSupprimé.bind(this),
      )

      .with(
        { type: 'ChangementPuissanceAccordé-V1' },
        this.applyChangementPuissanceAccordé.bind(this),
      )
      .with(
        { type: 'ChangementPuissanceRejeté-V1' },
        this.applyChangementPuissanceRejeté.bind(this),
      )
      .exhaustive();
  }

  private applyChangementPuissanceEnregistré({
    payload: { puissance },
  }: ChangementPuissanceEnregistréEvent) {
    this.#puissance = puissance;
  }

  private applyPuissanceImportée({ payload: { puissance } }: PuissanceImportéeEvent) {
    this.#puissance = puissance;
  }

  private applyPuissanceModifiée({ payload: { puissance } }: PuissanceModifiéeEvent) {
    this.#puissance = puissance;
  }

  private applyChangementPuissanceDemandé({
    payload: { puissance, autoritéCompétente },
  }: ChangementPuissanceDemandéEvent) {
    this.#demande = {
      statut: StatutChangementPuissance.demandé,
      nouvellePuissance: puissance,
      autoritéCompétente,
    };
  }

  private applyChangementPuissanceAnnulé(this: PuissanceAggregate) {
    this.#demande = undefined;
  }

  private applyChangementPuissanceAccordé({
    payload: { nouvellePuissance },
  }: ChangementPuissanceAccordéEvent) {
    this.#puissance = nouvellePuissance;
    this.#demande = undefined;
  }

  private applyChangementPuissanceRejeté(_: ChangementPuissanceRejetéEvent) {
    this.#demande = undefined;
  }

  private applyChangementPuissanceSupprimé(_: ChangementPuissanceSuppriméEvent) {
    this.#demande = undefined;
  }
}
