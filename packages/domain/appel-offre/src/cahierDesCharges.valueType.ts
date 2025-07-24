import { match } from 'ts-pattern';

import { InvalidOperationError, PlainType } from '@potentiel-domain/core';

import {
  AppelOffreReadModel,
  CahierDesChargesModifié,
  DomainesConcernésParChangement,
  DomainesCourriersRéponse,
  DonnéesCourriersRéponse,
  DonnéesCourriersRéponseParDomaine,
  Famille,
  Periode,
  Ratios,
  RèglesDemandesChangement,
  Technologie,
} from './appelOffre.entity';
import { RéférenceCahierDesCharges } from './appelOffre';

export type ValueType = {
  appelOffre: PlainType<AppelOffreReadModel>;
  période: PlainType<Periode>;
  famille: PlainType<Famille> | undefined;
  cahierDesChargesModificatif: PlainType<CahierDesChargesModifié> | undefined;
  technologie: Technologie | undefined;
  /**
   * Un changement peut être "information enregistrée" ou "demande" ou indisponible.
   * Cette règle, définie dans le Cahier des charges outrepasse celle de la période, qui elle même outrepasse celle de l'appel d'offre.
   **/
  changementEstDisponible(
    typeChangement: 'information-enregistrée' | 'demande',
    domaine: DomainesConcernésParChangement,
  ): boolean;
  /**
   * Applique les règles de @see ValueType.changementEstDisponible, en émettant une erreur si le changement n'est pas disponible.
   **/
  vérifierQueLeChangementEstPossible(
    typeChangement: 'information-enregistrée' | 'demande',
    domaine: DomainesConcernésParChangement,
  ): void;
  estSoumisAuxGarantiesFinancières(): boolean;
  getDélaiRéalisationEnMois(): number;
  getRatiosChangementPuissance(): Ratios;
  getDonnéesCourriersRéponse(domaine: DomainesCourriersRéponse): DonnéesCourriersRéponse;
  doitChoisirUnCahierDesChargesModificatif(): boolean;
  getRèglesChangements<TDomain extends keyof RèglesDemandesChangement>(
    domaine: TDomain,
  ): RèglesDemandesChangement[TDomain];
};

export const bind = ({
  appelOffre,
  période,
  famille,
  cahierDesChargesModificatif,
  technologie,
}: PlainType<ValueType>): ValueType => ({
  appelOffre,
  période,
  famille,
  cahierDesChargesModificatif,
  technologie,

  getRèglesChangements(domaine) {
    const changementIndisponible: RèglesDemandesChangement = {
      abandon: {},
      achèvement: {},
      actionnaire: {},
      délai: {},
      fournisseur: {},
      producteur: {},
      puissance: {},
      recours: {},
      représentantLégal: {},
    };

    const règlesChangement = {
      ...(this.appelOffre.changement === 'indisponible'
        ? changementIndisponible
        : this.appelOffre.changement),
      ...(this.période.changement === 'indisponible'
        ? changementIndisponible
        : this.période.changement),
      ...this.cahierDesChargesModificatif?.changement,
    };
    return règlesChangement[domaine];
  },

  changementEstDisponible(typeChangement, domaine) {
    const règlesChangement = this.getRèglesChangements(domaine);
    const règleTypeChangement = match(typeChangement)
      .with('demande', () => règlesChangement.demande)
      .with('information-enregistrée', () => règlesChangement.informationEnregistrée)
      .exhaustive();

    return règleTypeChangement === true;
  },

  vérifierQueLeChangementEstPossible(typeChangement, domaine) {
    if (!this.changementEstDisponible(typeChangement, domaine)) {
      throw new CahierDesChargesEmpêcheModificationError();
    }
  },

  doitChoisirUnCahierDesChargesModificatif() {
    const changement = this.période.changement ?? this.appelOffre.changement;
    return this.cahierDesChargesModificatif === undefined && changement === 'indisponible';
  },

  estSoumisAuxGarantiesFinancières() {
    const { appelOffre, famille } = this;
    const { soumisAuxGarantiesFinancieres } =
      famille?.garantiesFinancières ?? appelOffre.garantiesFinancières;
    return !!soumisAuxGarantiesFinancieres && soumisAuxGarantiesFinancieres !== 'non soumis';
  },

  getDélaiRéalisationEnMois() {
    if (!this.technologie) {
      throw new TechnologieNonSpécifiéeError();
    }
    if (this.appelOffre.multiplesTechnologies) {
      return this.appelOffre.délaiRéalisationEnMois[this.technologie];
    }

    return this.appelOffre.délaiRéalisationEnMois;
  },

  // TODO changementPuissance et seuilSupplémentaireChangementPuissance devraient être déplacés dans changement.puissance
  getRatiosChangementPuissance() {
    if (!this.technologie) {
      throw new TechnologieNonSpécifiéeError();
    }
    // prendre les ratios du CDC 2022 si existants
    if (
      this.cahierDesChargesModificatif &&
      RéférenceCahierDesCharges.bind(this.cahierDesChargesModificatif).estCDC2022()
    ) {
      const seuilsCDC = this.cahierDesChargesModificatif.seuilSupplémentaireChangementPuissance;

      if (seuilsCDC?.changementByTechnologie) {
        return seuilsCDC.ratios[this.technologie];
      } else if (seuilsCDC) {
        return seuilsCDC.ratios;
      }
    }

    // sinon prendre les ratio du CDC initial par technologie
    const { changementPuissance } = this.appelOffre;

    if (changementPuissance.changementByTechnologie) {
      return changementPuissance.ratios[this.technologie];
    }

    // sinon prendre les ratios du CDC initial
    return changementPuissance.ratios;
  },

  getDonnéesCourriersRéponse(domaine) {
    const key = match(domaine)
      .returnType<keyof DonnéesCourriersRéponseParDomaine>()
      .with('abandon', () => 'texteEngagementRéalisationEtModalitésAbandon')
      .with('délai', () => 'texteDélaisDAchèvement')
      .with('puissance', () => 'texteChangementDePuissance')
      .with('actionnaire', () => 'texteChangementDActionnariat')
      .exhaustive();

    const { dispositions, référenceParagraphe } = {
      ...this.appelOffre.donnéesCourriersRéponse[key],
      ...this.période.donnéesCourriersRéponse?.[key],
      ...this.cahierDesChargesModificatif?.donnéesCourriersRéponse?.[key],
    };

    if (!dispositions || !référenceParagraphe) {
      return {
        référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
        dispositions: '!!!CONTENU NON DISPONIBLE!!!',
      };
    }

    return { dispositions, référenceParagraphe };
  },
});

class TechnologieNonSpécifiéeError extends InvalidOperationError {
  constructor() {
    super("La technologie n'a pas été spécifiée");
  }
}

class CahierDesChargesEmpêcheModificationError extends InvalidOperationError {
  constructor() {
    super('Le cahier des charges de ce projet ne permet pas ce changement');
  }
}
