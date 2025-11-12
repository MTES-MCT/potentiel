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
  AccèsProjetDéjàAutoriséError,
  ProjetNonRéclamableError,
} from './accès.error';
import { RéclamerAccèsProjetOptions } from './réclamer/réclamerAccèsProjet.options';
import { RetirerAccèsProjetOptions } from './retirer/retirerAccèsProjet.options';
import { RemplacerAccèsProjetOptions } from './remplacer/remplacerAccèsProjet.options';
import { AccèsProjetRemplacéEvent } from './remplacer/remplacerAccèsProjet.event';

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
      autoriséPar: Email.système,
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

  async remplacer({
    identifiantUtilisateur,
    nouvelIdentifiantUtilisateur,
    remplacéLe,
    remplacéPar,
  }: RemplacerAccèsProjetOptions) {
    if (identifiantUtilisateur.estÉgaleÀ(nouvelIdentifiantUtilisateur)) {
      throw new AccèsProjetDéjàAutoriséError();
    }

    // si l'utilisateur actuel n'a pas accès, on ne donne pas accès non plus au nouvel utilisateur
    if (!this.aDéjàAccès(identifiantUtilisateur.formatter())) {
      return;
    }

    // si le nouvel utilisateur a déjà accès, il suffit de retirer les droits de l'actuel
    if (this.aDéjàAccès(nouvelIdentifiantUtilisateur.formatter())) {
      await this.retirer({
        identifiantUtilisateur,
        retiréLe: remplacéLe,
        retiréPar: remplacéPar,
      });
    } else {
      const event: AccèsProjetRemplacéEvent = {
        type: 'AccèsProjetRemplacé-V1',
        payload: {
          identifiantProjet: this.projet.identifiantProjet.formatter(),
          identifiantUtilisateur: identifiantUtilisateur.formatter(),
          nouvelIdentifiantUtilisateur: nouvelIdentifiantUtilisateur.formatter(),
          remplacéLe: remplacéLe.formatter(),
          remplacéPar: remplacéPar.formatter(),
        },
      };

      await this.publish(event);
    }
  }

  apply(event: AccèsEvent): void {
    match(event)
      .with({ type: 'AccèsProjetAutorisé-V1' }, this.applyAccèsProjetAutoriséV1.bind(this))
      .with({ type: 'AccèsProjetRetiré-V1' }, this.applyAccèsProjetRetiréV1.bind(this))
      .with({ type: 'AccèsProjetRemplacé-V1' }, this.applyAccèsProjetRemplacéV1.bind(this))
      .exhaustive();
  }

  private applyAccèsProjetRemplacéV1({
    payload: { identifiantUtilisateur, nouvelIdentifiantUtilisateur },
  }: AccèsProjetRemplacéEvent) {
    this.identifiantsUtilisateurAyantAccès.delete(identifiantUtilisateur);
    this.identifiantsUtilisateurAyantAccès.add(nouvelIdentifiantUtilisateur);
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
