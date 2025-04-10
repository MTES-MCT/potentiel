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
  identifiantProjet: string;
  appelOffre: AppelOffre.ConsulterAppelOffreReadModel;
  technologie: Candidature.TypeTechnologie.RawType;
  cahierDesCharges: ConsulterCahierDesChargesChoisiReadmodel;
  périodeId: string;
  nouvellePuissance: number;
  familleId: string;
  note: number;
  dépasseRatiosChangementPuissance: () => boolean;
  dépassePuissanceMaxDuVolumeRéservé: () => boolean;
  dépassePuissanceMaxFamille: () => boolean;
}>;

export const bind = ({
  ratio,
  appelOffre,
  note,
  périodeId,
  nouvellePuissance,
  familleId,
  technologie,
  cahierDesCharges,
}: PlainType<ValueType>): ValueType => {
  return {
    get ratio() {
      return ratio;
    },
    get identifiantProjet() {
      return '';
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
    get périodeId() {
      return périodeId;
    },
    get nouvellePuissance() {
      return nouvellePuissance;
    },
    get familleId() {
      return familleId;
    },
    get note() {
      return note;
    },
    estÉgaleÀ(valueType) {
      return this.ratio === valueType.ratio;
    },
    dépasseRatiosChangementPuissance(): boolean {
      const { min, max } = getRatiosChangementPuissance({
        appelOffre,
        technologie,
        cahierDesCharges,
        périodeId,
      });
      return dépasseRatiosChangementPuissance({
        minRatio: min,
        maxRatio: max,
        ratio,
      });
    },
    dépassePuissanceMaxFamille(): boolean {
      return dépassePuissanceMaxFamille({ appelOffre, périodeId, familleId, nouvellePuissance });
    },
    dépassePuissanceMaxDuVolumeRéservé(): boolean {
      return dépassePuissanceMaxDuVolumeRéservé({ note, périodeId, nouvellePuissance, appelOffre });
    },
  };
};
