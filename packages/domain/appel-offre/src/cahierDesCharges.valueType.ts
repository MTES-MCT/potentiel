import { match } from 'ts-pattern';

import { InvalidOperationError, PlainType } from '@potentiel-domain/core';

import {
  AppelOffreReadModel,
  CahierDesChargesModifié,
  DomainesConcernésParChangement,
  Famille,
  Periode,
  Technologie,
} from './appelOffre.entity';
import { RéférenceCahierDesCharges } from './appelOffre';

export type ValueType = {
  appelOffre: PlainType<AppelOffreReadModel>;
  période: PlainType<Periode>;
  famille: PlainType<Famille> | undefined;
  cahierDesChargesModificatif: PlainType<CahierDesChargesModifié> | undefined;
  technologie: Technologie | undefined;
  vérifierQueLeChangementEstPossible(
    typeChangement: 'information-enregistrée' | 'demande',
    domaine: DomainesConcernésParChangement,
  ): void;
  estSoumisAuxGarantiesFinancières(): boolean;
  getDélaiRéalisationEnMois(): number;
  getRatiosChangementPuissance(): { min: number; max: number };
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
  vérifierQueLeChangementEstPossible(typeChangement, domaine) {
    const changement = {
      ...this.appelOffre.changement,
      ...this.période.changement,
      ...this.cahierDesChargesModificatif?.changement,
    };

    const règlesChangement = changement[domaine] ?? {};
    const règleTypeChangement = match(typeChangement)
      .with('demande', () => règlesChangement.demande)
      .with('information-enregistrée', () => règlesChangement.informationEnregistrée)
      .exhaustive();

    if (règleTypeChangement !== true) {
      throw new CahierDesChargesEmpêcheModificationError();
    }
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
