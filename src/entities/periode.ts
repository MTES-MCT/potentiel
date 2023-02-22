import { CahierDesCharges } from './cahierDesCharges';
import { DonnéesCourriersRéponse } from './donnéesCourriersRéponse';
import { Territoire } from './territoire';

type NoteThresholdByFamily = {
  familleId: string;
  noteThreshold: number;
  territoire?: Territoire;
};

type NoteThresholdByCategory = {
  volumeReserve: {
    noteThreshold: number;
    puissanceMax: number;
  };
  autres: {
    noteThreshold: number;
  };
};

type NotifiedPeriode = {
  type?: 'notified';
  certificateTemplate: CertificateTemplate;
} & (
  | {
      noteThresholdBy: 'family';
      noteThreshold: NoteThresholdByFamily[];
    }
  | {
      noteThresholdBy: 'category';
      noteThreshold: NoteThresholdByCategory;
    }
  | {
      noteThresholdBy?: undefined;
      noteThreshold: number;
    }
);

type NotYetNotifiedPeriode = {
  type: 'not-yet-notified';
  certificateTemplate: CertificateTemplate;
  noteThresholdBy?: undefined;
  noteThreshold?: undefined;
};

type LegacyPeriode = {
  type: 'legacy';
  certificateTemplate?: undefined;
  noteThresholdBy?: undefined;
  noteThreshold?: undefined;
};

export type CertificateTemplate = 'cre4.v0' | 'cre4.v1' | 'ppe2.v1' | 'ppe2.v2';

export type Periode = {
  id: string;
  title: string;
  donnéesCourriersRéponse?: Partial<DonnéesCourriersRéponse>;
  cahierDesCharges: CahierDesCharges;
  delaiDcrEnMois: {
    valeur: number;
    texte: string;
  };
  dossierSuiviPar?: string;
  garantieFinanciereEnMoisSansAutorisationEnvironnementale?: number;
} & (NotifiedPeriode | NotYetNotifiedPeriode | LegacyPeriode);

export const isNotifiedPeriode = (periode: Periode): periode is Periode & NotifiedPeriode => {
  return (
    periode.type === 'notified' ||
    (periode.type === undefined && periode.noteThreshold !== undefined)
  );
};
