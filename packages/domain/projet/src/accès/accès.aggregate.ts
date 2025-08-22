import { match } from 'ts-pattern';

import { Email } from '@potentiel-domain/common';
import { AbstractAggregate } from '@potentiel-domain/core';

import type { ProjetAggregateRoot } from '../projet.aggregateRoot';
import {
  AccèsProjetDéjàAutoriséError,
  EmailNonCorrespondantError,
  PrixEtNuméroCRENonCorrespondantError,
  ProjetNonNotiféError,
  ProjetNonRéclamableError,
  RetraitDeSesAccèsProjetError,
  UtilisateurAPasAccèsAuProjetError,
} from './accès.error';
import type { AccèsEvent } from './accès.event';
import type { AccèsProjetAutoriséEvent } from './autoriser/autoriserAccèsProjet.event';
import type { AutoriserAccèsProjetOptions } from './autoriser/autoriserAccèsProjet.options';
import type { AccèsProjetRetiréEvent } from './retirer/retirerAccèsProjet.event';
import type { RetirerAccèsProjetOptions } from './retirer/retirerAccèsProjet.options';
import type { RéclamerAccèsProjetOptions } from './réclamer/réclamerAccèsProjet.options';

export class AccèsAggregate extends AbstractAggregate<AccèsEvent, 'accès', ProjetAggregateRoot> {
  get projet() {
    return this.parent;
  }

  identifiantsUtilisateurAyantAccès: Set<Email.RawType> = new Set();

  async réclamer(options: RéclamerAccèsProjetOptions) {
    const { identifiantUtilisateur, dateRéclamation, type } = options;

    if (!this.projet.estNotifié) {
      throw new ProjetNonNotiféError();
    }

    if (this.identifiantsUtilisateurAyantAccès.size > 0) {
      throw new ProjetNonRéclamableError();
    }

    if (type === 'avec-prix-numéro-cre') {
      const { numéroCRE, prix } = options;

      const connaîtLePrixEtNuméroCRE =
        this.projet.identifiantProjet.numéroCRE === numéroCRE &&
        this.projet.candidature.prixRéférence === prix;

      if (!connaîtLePrixEtNuméroCRE) {
        throw new PrixEtNuméroCRENonCorrespondantError();
      }
    }

    if (type === 'même-email-candidature') {
      const aLeMêmeEmailQueLaCandidature =
        this.projet.candidature.emailContact.estÉgaleÀ(identifiantUtilisateur);

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
    if (this.aDéjàAccès(identifiantUtilisateur.formatter())) {
      throw new AccèsProjetDéjàAutoriséError();
    }

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

  async retirer({
    identifiantUtilisateur,
    retiréLe: retirerLe,
    retiréPar: retirerPar,
    cause,
  }: RetirerAccèsProjetOptions) {
    if (retirerPar.estÉgaleÀ(identifiantUtilisateur)) {
      throw new RetraitDeSesAccèsProjetError();
    }

    if (!this.aDéjàAccès(identifiantUtilisateur.formatter())) {
      throw new UtilisateurAPasAccèsAuProjetError();
    }

    const event: AccèsProjetRetiréEvent = {
      type: 'AccèsProjetRetiré-V1',
      payload: {
        identifiantProjet: this.projet.identifiantProjet.formatter(),
        identifiantsUtilisateur: [identifiantUtilisateur.formatter()],
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
        identifiantsUtilisateur: Array.from(this.identifiantsUtilisateurAyantAccès),
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
    this.identifiantsUtilisateurAyantAccès.add(identifiantUtilisateur);
  }

  private applyAccèsProjetRetiréV1({
    payload: { identifiantsUtilisateur },
  }: AccèsProjetRetiréEvent) {
    identifiantsUtilisateur.map((identifiantUtilisateurValue) => {
      this.identifiantsUtilisateurAyantAccès.delete(identifiantUtilisateurValue);
    });
  }

  private aDéjàAccès(identifiantUtilisateur: Email.RawType): boolean {
    return this.identifiantsUtilisateurAyantAccès.has(identifiantUtilisateur);
  }
}
