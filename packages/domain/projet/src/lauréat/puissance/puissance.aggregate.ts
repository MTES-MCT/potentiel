import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

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
  PuissanceDeSiteDoitÊtreModifiéeError,
  PuissanceDeSiteNulleOuNégativeError,
  PuissanceDoitÊtreModifiéeError,
  PuissanceDéjàImportéeError,
  PuissanceIdentiqueError,
  PuissanceNulleOuNégativeError,
} from './puissance.error';
import { ChangementPuissanceRejetéEvent } from './changement/rejeter/rejeterChangementPuissance.event';
import { RejeterChangementPuissanceOptions } from './changement/rejeter/rejeterChangementPuissance.options';
import { PuissanceEvent } from './puissance.event';
import {
  DemandeDeChangementInexistanteError,
  RéponseSignéeObligatoireSiAccordSansDécisionDeLEtatError,
} from './changement/errors';

export class PuissanceAggregate extends AbstractAggregate<
  PuissanceEvent,
  'puissance',
  LauréatAggregate
> {
  #puissance!: number;

  #puissanceDeSite?: number;

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

  async importer({ puissance, puissanceDeSite, importéeLe }: ImporterOptions) {
    if (this.#puissance) {
      throw new PuissanceDéjàImportéeError();
    }

    if (puissance <= 0) {
      throw new PuissanceNulleOuNégativeError();
    }

    if (puissanceDeSite !== undefined && puissanceDeSite <= 0) {
      throw new PuissanceDeSiteNulleOuNégativeError();
    }

    const event: PuissanceImportéeEvent = {
      type: 'PuissanceImportée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        puissance,
        puissanceDeSite,
        importéeLe: importéeLe.formatter(),
      },
    };

    await this.publish(event);
  }

  async modifier({
    puissance,
    puissanceDeSite,
    dateModification,
    identifiantUtilisateur,
    raison,
  }: ModifierOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    if (this.#puissance === puissance) {
      throw new PuissanceIdentiqueError();
    }

    if (puissance !== undefined && puissance <= 0) {
      throw new PuissanceNulleOuNégativeError();
    }

    if (puissanceDeSite !== undefined && puissanceDeSite <= 0) {
      throw new PuissanceDeSiteNulleOuNégativeError();
    }

    if (this.#demande?.statut.estDemandé()) {
      throw new DemandeDeChangementPuissanceEnCoursError();
    }

    if (
      this.lauréat.projet.appelOffre.champsSupplémentaires?.puissanceDeSite &&
      this.#puissanceDeSite !== undefined
    ) {
      if (puissanceDeSite === undefined) {
        throw new PuissanceDeSiteDoitÊtreModifiéeError();
      }
    } else {
      if (!puissance) {
        throw new PuissanceDoitÊtreModifiéeError();
      }
    }

    const event: PuissanceModifiéeEvent = {
      type: 'PuissanceModifiée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        puissance,
        puissanceDeSite,
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

    const event: ChangementPuissanceDemandéEvent = {
      type: 'ChangementPuissanceDemandé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        puissance: nouvellePuissance,
        autoritéCompétente: AutoritéCompétente.déterminer().autoritéCompétente,
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
    estUneDécisionDEtat,
  }: AccorderChangementPuissanceOptions) {
    if (!this.#demande) {
      throw new DemandeDeChangementInexistanteError();
    }

    this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementPuissance.accordé,
    );

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
    estUneDécisionDEtat,
  }: RejeterChangementPuissanceOptions) {
    if (!this.#demande) {
      throw new DemandeDeChangementInexistanteError();
    }

    this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementPuissance.rejeté,
    );

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
    this.lauréat.vérifierQueLeChangementEstPossible(type, 'puissance');

    RatioChangementPuissance.bind({
      ratios: this.lauréat.projet.cahierDesChargesActuel.getRatiosChangementPuissance(),
      puissanceInitiale: this.lauréat.projet.candidature.puissanceProductionAnnuelle,
      puissanceMaxFamille: this.lauréat.projet.famille?.puissanceMax,
      nouvellePuissance,
      volumeRéservé: this.lauréat.projet.candidature.volumeRéservé,
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

  private applyPuissanceImportée({
    payload: { puissance, puissanceDeSite },
  }: PuissanceImportéeEvent) {
    this.#puissance = puissance;
    this.#puissanceDeSite = puissanceDeSite;
  }

  private applyPuissanceModifiée({
    payload: { puissance, puissanceDeSite },
  }: PuissanceModifiéeEvent) {
    this.#puissance = puissance ? puissance : this.#puissance;
    this.#puissanceDeSite = puissanceDeSite ? puissanceDeSite : this.#puissanceDeSite;
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
