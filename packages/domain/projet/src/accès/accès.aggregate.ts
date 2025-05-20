import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { Email } from '@potentiel-domain/common';

import { ProjetAggregateRoot } from '../projet.aggregateRoot';

import { AccèsEvent } from './accès.event';
import { AccèsProjetAutoriséEvent } from './autoriser/autoriserAccèsProjet.event';
import { AutoriserAccèsProjetOptions } from './autoriser/autoriserAccèsProjet.options';
import { AccèsProjetRetiréEvent } from './retirer/retirerAccèsProjet.event';
import {
  ProjetNonNotiféError,
  EmailNonCorrespondantError,
  PrixEtNuméroCRENonCorrespondantError,
  RetraitDeSesAccèsProjetError,
  UtilisateurAPasAccèsAuProjetError,
} from './accès.error';
import { RéclamerAccèsProjetOptions } from './réclamer/réclamerAccèsProjet.options';
import { RetirerAccèsProjetOptions } from './retirer/retirerAccèsProjet.options';

export class AccèsAggregate extends AbstractAggregate<AccèsEvent> {
  #projet!: ProjetAggregateRoot;
  get projet() {
    return this.#projet;
  }

  #utilisateursAyantAccès: Array<Email.ValueType> = [];

  async init(projet: ProjetAggregateRoot) {
    this.#projet = projet;
  }

  async réclamer(options: RéclamerAccèsProjetOptions) {
    const { identifiantUtilisateur, dateRéclamation, type } = options;

    if (!this.projet.statut.estNotifié()) {
      throw new ProjetNonNotiféError();
    }

    if (type === 'avec-prix-numéro-cre') {
      const { numéroCRE, prix } = options;

      const connaîtLePrixEtNuméroCRE =
        this.#projet.identifiantProjet.numéroCRE === numéroCRE &&
        this.#projet.candidature.prixRéférence === prix;

      if (!connaîtLePrixEtNuméroCRE) {
        throw new PrixEtNuméroCRENonCorrespondantError();
      }
    }

    if (type === 'même-email-candidature') {
      const aLeMêmeEmailQueLaCandidature =
        this.#projet.candidature.emailContact.estÉgaleÀ(identifiantUtilisateur);

      if (!aLeMêmeEmailQueLaCandidature) {
        throw new EmailNonCorrespondantError();
      }
    }

    await this.autoriser({
      identifiantUtilisateur,
      autoriséLe: dateRéclamation,
      autoriséPar: Email.system(),
      raison: 'réclamation',
    });
  }

  async autoriser({
    identifiantUtilisateur,
    autoriséLe,
    autoriséPar,
    raison,
  }: AutoriserAccèsProjetOptions) {
    if (!this.#utilisateursAyantAccès.includes(identifiantUtilisateur)) {
      const event: AccèsProjetAutoriséEvent = {
        type: 'AccèsProjetAutorisé-V1',
        payload: {
          identifiantProjet: this.projet.identifiantProjet.formatter(),
          identifiantUtilisateur: identifiantUtilisateur.formatter(),
          autoriséLe: autoriséLe.formatter(),
          autoriséPar: autoriséPar.formatter(),
          raison,
        },
      };

      await this.publish(event);
    }
  }

  async retirer({
    identifiantUtilisateur,
    retiréLe: retirerLe,
    retiréPar: retirerPar,
    cause,
  }: RetirerAccèsProjetOptions) {
    if (retirerPar.estÉgaleÀ(identifiantUtilisateur)) {
      throw new RetraitDeSesAccèsProjetError();
    }

    if (
      !this.#utilisateursAyantAccès.find((utilisateurAyantAccès) =>
        utilisateurAyantAccès.estÉgaleÀ(identifiantUtilisateur),
      )
    ) {
      throw new UtilisateurAPasAccèsAuProjetError();
    }

    const event: AccèsProjetRetiréEvent = {
      type: 'AccèsProjetRetiré-V1',
      payload: {
        identifiantProjet: this.projet.identifiantProjet.formatter(),
        identifiantUtilisateurs: [identifiantUtilisateur.formatter()],
        retiréLe: retirerLe.formatter(),
        retiréPar: retirerPar.formatter(),
        cause,
      },
    };

    await this.publish(event);
  }

  async retirerTous({
    retiréLe,
    retiréPar,
    cause,
  }: Omit<RetirerAccèsProjetOptions, 'identifiantUtilisateur'>) {
    const event: AccèsProjetRetiréEvent = {
      type: 'AccèsProjetRetiré-V1',
      payload: {
        identifiantProjet: this.projet.identifiantProjet.formatter(),
        identifiantUtilisateurs: this.#utilisateursAyantAccès.map((u) => u.formatter()),
        retiréLe: retiréLe.formatter(),
        retiréPar: retiréPar.formatter(),
        cause,
      },
    };

    await this.publish(event);
  }

  apply(event: AccèsEvent): void {
    match(event)
      .with(
        {
          type: 'AccèsProjetAutorisé-V1',
        },
        (event) => this.applyAccèsProjetAutoriséV1(event),
      )
      .with(
        {
          type: 'AccèsProjetRetiré-V1',
        },
        (event) => this.applyAccèsProjetRetiréV1(event),
      )
      .exhaustive();
  }

  private applyAccèsProjetAutoriséV1({
    payload: { identifiantUtilisateur },
  }: AccèsProjetAutoriséEvent) {
    this.#utilisateursAyantAccès.push(Email.convertirEnValueType(identifiantUtilisateur));
  }

  private applyAccèsProjetRetiréV1({
    payload: { identifiantUtilisateurs },
  }: AccèsProjetRetiréEvent) {
    identifiantUtilisateurs.map((identifiantUtilisateurValue) => {
      const index = this.#utilisateursAyantAccès.findIndex((identifiantUtilisateur) =>
        identifiantUtilisateur.estÉgaleÀ(Email.convertirEnValueType(identifiantUtilisateurValue)),
      );

      if (index > -1) {
        this.#utilisateursAyantAccès.splice(index, 1);
      }
    });
  }
}
