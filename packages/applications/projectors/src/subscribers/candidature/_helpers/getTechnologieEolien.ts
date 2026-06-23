import type { Candidature } from '@potentiel-domain/projet';

export const getTechnologieEolien = (value?: string): Candidature.TechnologieEolien | undefined => {
  if (!value) return undefined;

  const v = value
    .toLowerCase()
    .normalize('NFD') // isole les accents
    .replace(/\p{Diacritic}/gu, ''); // retire les accents

  const isAsynchrone =
    /\basynchrone\b/.test(v) ||
    /\bnon direct\b/.test(v) ||
    /\bindirect\b/.test(v) ||
    /\bsans entrainement direct\b/.test(v);

  const isSynchrone =
    /\bsynchrone\b/.test(v) ||
    (/\bentrainement direct\b/.test(v) && !/\bsans entrainement direct\b/.test(v));

  if (isAsynchrone && isSynchrone) {
    return undefined;
  }

  if (isAsynchrone) return 'asynchrone';
  if (isSynchrone) return 'synchrone';

  return undefined;
};
