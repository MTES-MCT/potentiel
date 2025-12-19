import { match } from 'ts-pattern';

import { InvalidOperationError, PlainType } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { TypeActionnariat } from './candidature';

export type ValueType = {
  appelOffre: PlainType<AppelOffre.AppelOffreReadModel>;
  période: PlainType<AppelOffre.Periode>;
  famille: PlainType<AppelOffre.Famille> | undefined;
  cahierDesChargesModificatif: PlainType<AppelOffre.CahierDesChargesModifié> | undefined;
  technologie: AppelOffre.Technologie | undefined;
  /**
   * Un changement peut être "information enregistrée" ou "demande" ou indisponible.
   * Cette règle, définie dans le Cahier des charges outrepasse celle de la période, qui elle même outrepasse celle de l'appel d'offre.
   **/
  changementEstDisponible(
    typeChangement: 'information-enregistrée' | 'demande',
    domaine: AppelOffre.DomainesConcernésParChangement,
  ): boolean;
  /**
   * Applique les règles de @see ValueType.changementEstDisponible, en émettant une erreur si le changement n'est pas disponible.
   **/
  vérifierQueLeChangementEstPossible(
    typeChangement: 'information-enregistrée' | 'demande',
    domaine: AppelOffre.DomainesConcernésParChangement,
  ): void;
  estSoumisAuxGarantiesFinancières(): boolean;
  getDélaiRéalisationEnMois(): number;
  getRatiosChangementPuissance(): AppelOffre.Ratios;
  getDonnéesCourriersRéponse(
    domaine: AppelOffre.DomainesCourriersRéponse,
  ): AppelOffre.DonnéesCourriersRéponse;
  doitChoisirUnCahierDesChargesModificatif(): boolean;
  getRèglesChangements<TDomain extends keyof AppelOffre.RèglesDemandesChangement>(
    domaine: TDomain,
  ): AppelOffre.RèglesDemandesChangement[TDomain];
  getAutoritéCompétente(domain: 'abandon' | 'délai'): AppelOffre.AutoritéCompétente;
  getChampsSupplémentaires(): AppelOffre.ChampsSupplémentairesCandidature;
  getTypesActionnariat(): TypeActionnariat.RawType[];
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
    const changementOuModificationIndisponible: AppelOffre.RèglesDemandesChangement = {
      nomProjet: {},
      abandon: {},
      actionnaire: { modificationAdmin: true },
      délai: {},
      fournisseur: { modificationAdmin: true },
      producteur: { modificationAdmin: true },
      puissance: { modificationAdmin: true },
      recours: {},
      représentantLégal: { modificationAdmin: true },
      natureDeLExploitation: { modificationAdmin: true },
      installateur: { modificationAdmin: true },
      dispositifDeStockage: { modificationAdmin: true },
      siteDeProduction: { modificationAdmin: true },
    };

    const règlesChangement = {
      ...(this.appelOffre.changement === 'indisponible'
        ? changementOuModificationIndisponible
        : this.appelOffre.changement),
      ...(this.période.changement === 'indisponible'
        ? changementOuModificationIndisponible
        : this.période.changement),
      ...this.cahierDesChargesModificatif?.changement,
    };
    return règlesChangement[domaine];
  },

  getAutoritéCompétente(domaine) {
    const règlesChangement = this.getRèglesChangements(domaine);
    if (!règlesChangement.demande) {
      throw new CahierDesChargesEmpêcheModificationError();
    }
    return règlesChangement.autoritéCompétente;
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

  getRatiosChangementPuissance() {
    if (!this.technologie) {
      throw new TechnologieNonSpécifiéeError();
    }
    const règlesPuissance = this.getRèglesChangements('puissance');
    if (!règlesPuissance.demande) {
      throw new CahierDesChargesEmpêcheModificationError();
    }
    if (règlesPuissance.changementByTechnologie) {
      return règlesPuissance.ratios[this.technologie];
    }
    return règlesPuissance.ratios;
  },

  getDonnéesCourriersRéponse(domaine) {
    const key = match(domaine)
      .returnType<keyof AppelOffre.DonnéesCourriersRéponseParDomaine>()
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
  getChampsSupplémentaires() {
    return {
      ...this.appelOffre.champsSupplémentaires,
      ...this.période.champsSupplémentaires,
    };
  },
  getTypesActionnariat() {
    return [
      ...(this.appelOffre.cycleAppelOffre === 'PPE2'
        ? TypeActionnariat.ppe2Types
        : TypeActionnariat.cre4Types),
    ];
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
