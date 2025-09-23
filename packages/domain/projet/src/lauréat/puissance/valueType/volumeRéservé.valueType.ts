import { AppelOffre } from '@potentiel-domain/appel-offre';
import { PlainType } from '@potentiel-domain/core';

export type ValueType = {
  puissanceMax: number;
  estDansLeVolumeRéservé: boolean;
  dépassePuissanceMax(puissance: number): boolean;
};

export const bind = ({
  puissanceMax,
  estDansLeVolumeRéservé,
}: PlainType<ValueType>): ValueType => ({
  puissanceMax,
  estDansLeVolumeRéservé,
  dépassePuissanceMax(puissance: number) {
    if (!estDansLeVolumeRéservé) {
      return false;
    }
    return puissance > this.puissanceMax;
  },
});

type DéterminerProps = {
  période: PlainType<AppelOffre.Periode>;
  note: number;
  puissanceInitiale: number;
};

export const déterminer = ({ note, puissanceInitiale, période }: DéterminerProps) => {
  if (période.noteThresholdBy !== 'category') {
    return;
  }
  const { noteThreshold, puissanceMax } = période.noteThreshold.volumeReserve;
  return bind({
    puissanceMax,
    estDansLeVolumeRéservé: puissanceInitiale <= puissanceMax && note >= noteThreshold,
  });
};
