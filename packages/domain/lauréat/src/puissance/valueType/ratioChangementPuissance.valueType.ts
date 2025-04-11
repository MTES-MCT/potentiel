import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';

import { ConsulterCahierDesChargesChoisiReadmodel } from '../../cahierDesChargesChoisi';

import {
  dépassePuissanceMaxDuVolumeRéservé,
  dépassePuissanceMaxFamille,
  dépasseRatiosChangementPuissance,
  getRatiosChangementPuissance,
} from './helpers';

export type RawType = number;

export type ValueType = ReadonlyValueType<{
  ratio: number;
  appelOffre: PlainType<AppelOffre.ConsulterAppelOffreReadModel>;
  technologie: Candidature.TypeTechnologie.RawType;
  cahierDesCharges: PlainType<ConsulterCahierDesChargesChoisiReadmodel>;
  période: PlainType<AppelOffre.Periode>;
  nouvellePuissance: number;
  famille?: AppelOffre.Famille;
  note: number;
  dépasseRatiosChangementPuissance: () => { enDeçaDeMin: boolean; dépasseMax: boolean };
  dépassePuissanceMaxDuVolumeRéservé: () => boolean;
  dépassePuissanceMaxFamille: () => boolean;
}>;

export const bind = ({
  ratio,
  appelOffre,
  note,
  période,
  nouvellePuissance,
  famille,
  technologie,
  cahierDesCharges,
}: PlainType<ValueType>): ValueType => {
  return {
    get ratio() {
      return ratio;
    },
    get appelOffre() {
      return appelOffre;
    },
    get technologie() {
      return technologie;
    },
    get cahierDesCharges() {
      return cahierDesCharges;
    },
    get période() {
      return période;
    },
    get nouvellePuissance() {
      return nouvellePuissance;
    },
    get famille() {
      return famille;
    },
    get note() {
      return note;
    },
    estÉgaleÀ(valueType) {
      return this.ratio === valueType.ratio;
    },
    dépasseRatiosChangementPuissance(): { enDeçaDeMin: boolean; dépasseMax: boolean } {
      const { min, max } = getRatiosChangementPuissance({
        appelOffre: this.appelOffre,
        technologie,
        cahierDesCharges: this.cahierDesCharges,
      });
      return dépasseRatiosChangementPuissance({
        minRatio: min,
        maxRatio: max,
        ratio,
      });
    },
    dépassePuissanceMaxFamille(): boolean {
      return dépassePuissanceMaxFamille({
        famille: this.famille,
        nouvellePuissance,
      });
    },
    dépassePuissanceMaxDuVolumeRéservé(): boolean {
      return dépassePuissanceMaxDuVolumeRéservé({
        note,
        période,
        nouvellePuissance,
        puissanceActuelle: nouvellePuissance / this.ratio,
      });
    },
  };
};
