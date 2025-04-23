import { match } from 'ts-pattern';

import { AbstractAggregate, LoadAggregateV2, mapToPlainObject } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { ProjetAggregateRoot } from '../projet.aggregateRoot';
import { Candidature } from '..';

import { LauréatEvent } from './lauréat.event';
import {
  LauréatNotifiéEvent,
  LauréatNotifiéV1Event,
  NomEtLocalitéLauréatImportésEvent,
} from './notifier/lauréatNotifié.event';
import { LauréatModifiéEvent } from './modifier/lauréatModifié.event';
import { ModifierLauréatOptions } from './modifier/modifierLauréat.option';
import { LauréatDéjàNotifiéError, LauréatNonTrouvéError } from './lauréat.error';

export class LauréatAggregate extends AbstractAggregate<LauréatEvent> {
  #projet!: ProjetAggregateRoot;
  #nomProjet?: string;
  #localité?: Candidature.Localité.ValueType;
  #notifiéLe?: DateTime.ValueType;

  get projet() {
    return this.#projet;
  }

  async init(projet: ProjetAggregateRoot, _loadAggregate: LoadAggregateV2) {
    this.#projet = projet;
  }

  async notifier({ attestation: { format } }: { attestation: { format: string } }) {
    this.vérifierQueLeLauréatPeutÊtreNotifié();
    const { notifiéeLe, notifiéePar, nomProjet, localité } = this.#projet.candidature;
    const event: LauréatNotifiéEvent = {
      type: 'LauréatNotifié-V2',
      payload: {
        identifiantProjet: this.#projet.identifiantProjet.formatter(),
        notifiéLe: notifiéeLe.formatter(),
        notifiéPar: notifiéePar.formatter(),
        attestation: {
          format,
        },
        nomProjet,
        localité: mapToPlainObject(localité),
      },
    };

    await this.publish(event);
  }

  async modifier({
    identifiantProjet,
    modifiéLe,
    modifiéPar,
    nomProjet,
    localité: { adresse1, adresse2, codePostal, commune, département, région },
  }: ModifierLauréatOptions) {
    this.vérifierQueLeLauréatExiste();
    const event: LauréatModifiéEvent = {
      type: 'LauréatModifié-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        modifiéLe: modifiéLe.formatter(),
        modifiéPar: modifiéPar.formatter(),
        nomProjet,
        localité: {
          adresse1,
          adresse2,
          codePostal,
          commune,
          département,
          région,
        },
      },
    };

    await this.publish(event);
  }

  private vérifierQueLeLauréatPeutÊtreNotifié() {
    if (this.#notifiéLe) {
      throw new LauréatDéjàNotifiéError();
    }
  }

  vérifierQueLeLauréatExiste() {
    if (!this.exists) {
      throw new LauréatNonTrouvéError();
    }
  }

  apply(event: LauréatEvent): void {
    match(event)
      .with({ type: 'LauréatNotifié-V1' }, (event) => this.applyLauréatNotifiéV1(event))
      .with({ type: 'NomEtLocalitéLauréatImportés-V1' }, (event) =>
        this.applyNomEtlocalitéLauréatImportés(event),
      )
      .with({ type: 'LauréatNotifié-V2' }, (event) => this.applyLauréatNotifié(event))
      .with({ type: 'LauréatModifié-V1' }, (event) => this.applyLauréatModifié(event))
      .exhaustive();
  }

  private applyLauréatNotifiéV1({ payload: { notifiéLe } }: LauréatNotifiéV1Event) {
    this.#notifiéLe = DateTime.convertirEnValueType(notifiéLe);
  }

  private applyNomEtlocalitéLauréatImportés({
    payload: { localité, nomProjet },
  }: NomEtLocalitéLauréatImportésEvent) {
    this.#nomProjet = nomProjet;
    this.#localité = Candidature.Localité.bind(localité);
  }

  private applyLauréatNotifié({
    payload: { notifiéLe, localité, nomProjet },
  }: LauréatNotifiéEvent) {
    this.#notifiéLe = DateTime.convertirEnValueType(notifiéLe);
    this.#nomProjet = nomProjet;
    this.#localité = Candidature.Localité.bind(localité);
  }

  private applyLauréatModifié({ payload: { nomProjet, localité } }: LauréatModifiéEvent) {
    this.#nomProjet = nomProjet;
    this.#localité = Candidature.Localité.bind(localité);
  }
}
