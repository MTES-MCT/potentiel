import { Option } from '@potentiel-libraries/monads';
import { AggregateType, LoadAggregate } from '@potentiel-domain/core';
import {
  AppelOffre,
  AppelOffreAggregate,
  LoadAppelOffreAggregatePort,
} from '@potentiel-domain/appel-offre';

import { CahierDesCharges, IdentifiantProjet } from '.';

import { ÉliminéAggregate } from './éliminé/éliminé.aggregate';
import {
  AppelOffreInexistantError,
  CahierDesChargesInexistantError,
  FamilleInexistanteError,
  PériodeInexistanteError,
} from './appelOffre.error';
import { CandidatureAggregate } from './candidature/candidature.aggregate';
import { LauréatAggregate } from './lauréat/lauréat.aggregate';
import { AccèsAggregate } from './accès/accès.aggregate';

interface ProjetAggregateRootDependencies {
  loadAggregate: LoadAggregate;
  loadAppelOffreAggregate: LoadAppelOffreAggregatePort;
}

class ProjetAggregateRootAlreadyInitialized extends Error {
  constructor() {
    super('ProjetAggregateRoot instance already initialized');
  }
}

export class ProjetAggregateRoot {
  #initialized: boolean = false;
  #loadAggregate: LoadAggregate;
  #loadAppelOffreAggregate: LoadAppelOffreAggregatePort;

  #identifiantProjet: IdentifiantProjet.ValueType;

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  #éliminé!: AggregateType<ÉliminéAggregate>;

  get éliminé() {
    return this.#éliminé;
  }

  #lauréat!: AggregateType<LauréatAggregate>;

  get lauréat() {
    return this.#lauréat;
  }

  #appelOffre!: AppelOffreAggregate;

  get appelOffre() {
    return this.#appelOffre;
  }

  #accès!: AggregateType<AccèsAggregate>;
  get accès() {
    return this.#accès;
  }

  #candidature!: AggregateType<CandidatureAggregate>;
  get candidature() {
    return this.#candidature;
  }

  get estNotifié() {
    return this.#lauréat.estNotifié || this.#éliminé.estNotifié;
  }

  #période!: AppelOffre.Periode;
  get période() {
    return this.#période;
  }

  #famille?: AppelOffre.Famille;
  get famille() {
    return this.#famille;
  }

  get cahierDesChargesActuel() {
    const cahierDesChargesModificatif = this.lauréat.exists
      ? this.période.cahiersDesChargesModifiésDisponibles.find((cdc) =>
          AppelOffre.RéférenceCahierDesCharges.bind(cdc).estÉgaleÀ(
            this.lauréat.référenceCahierDesCharges,
          ),
        )
      : undefined;
    if (!this.lauréat.référenceCahierDesCharges.estInitial() && !cahierDesChargesModificatif) {
      throw new CahierDesChargesInexistantError(
        this.appelOffre.id,
        this.période.id,
        this.lauréat.référenceCahierDesCharges.formatter(),
      );
    }
    return CahierDesCharges.bind({
      appelOffre: this.appelOffre,
      période: this.période,
      famille: this.famille,
      cahierDesChargesModificatif,
      technologie: this.candidature.exists
        ? this.candidature.technologie.type
        : this.appelOffre.technologie,
    });
  }

  private constructor(
    identifiantProjet: IdentifiantProjet.ValueType,
    loadAggregate: LoadAggregate,
    loadAppelOffreAggregate: LoadAppelOffreAggregatePort,
  ) {
    this.#identifiantProjet = identifiantProjet;
    this.#loadAggregate = loadAggregate;
    this.#loadAppelOffreAggregate = loadAppelOffreAggregate;
  }

  static async get(
    identifiantProjet: IdentifiantProjet.ValueType,
    { loadAggregate, loadAppelOffreAggregate }: ProjetAggregateRootDependencies,
    skipInitialization: boolean = false,
  ) {
    const root = new ProjetAggregateRoot(identifiantProjet, loadAggregate, loadAppelOffreAggregate);
    await root.init(skipInitialization);
    return root;
  }

  private async init(skipInitialization: boolean) {
    if (this.#initialized) {
      throw new ProjetAggregateRootAlreadyInitialized();
    }

    this.#accès = await this.#loadAggregate(
      AccèsAggregate,
      `accès|${this.identifiantProjet.formatter()}`,
      this,
    );

    this.#candidature = await this.#loadAggregate(
      CandidatureAggregate,
      `candidature|${this.identifiantProjet.formatter()}`,
      this,
    );

    this.#lauréat = await this.#loadAggregate(
      LauréatAggregate,
      `lauréat|${this.identifiantProjet.formatter()}`,
      this,
    );
    if (!skipInitialization) {
      await this.#lauréat.init();
    }

    this.#éliminé = await this.#loadAggregate(
      ÉliminéAggregate,
      `éliminé|${this.identifiantProjet.formatter()}`,
      this,
    );
    if (!skipInitialization) {
      await this.#éliminé.init();
    }

    const appelOffre = await this.#loadAppelOffreAggregate(this.#identifiantProjet.appelOffre);

    if (Option.isNone(appelOffre)) {
      throw new AppelOffreInexistantError(this.#identifiantProjet.appelOffre);
    }
    this.#appelOffre = appelOffre;

    const période = this.appelOffre.periodes.find((x) => x.id === this.identifiantProjet.période);

    if (!période) {
      throw new PériodeInexistanteError(
        this.#identifiantProjet.appelOffre,
        this.identifiantProjet.période,
      );
    }
    this.#période = période;

    if (this.identifiantProjet.famille) {
      const famille = this.période.familles.find((x) => x.id === this.identifiantProjet.famille);
      if (!famille) {
        throw new FamilleInexistanteError(
          this.#identifiantProjet.appelOffre,
          this.identifiantProjet.période,
          this.identifiantProjet.famille,
        );
      }
      this.#famille = famille;
    }

    this.#initialized = true;
  }
}
