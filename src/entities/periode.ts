import { Periode, NotifiedPeriode } from '@potentiel/domain-views';

export const isNotifiedPeriode = (periode: Periode): periode is Periode & NotifiedPeriode => {
  return (
    periode.type === 'notified' ||
    (periode.type === undefined && periode.noteThreshold !== undefined)
  );
};
