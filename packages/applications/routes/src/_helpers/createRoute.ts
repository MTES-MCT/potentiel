import { encodeParameter } from '../encodeParameter.js';

export const createIdentifiantRoute =
  (root: `/${string}`) =>
  (pathname: '' | `/${string}` = '') =>
  (identifiant: string) =>
    `${root}/${encodeParameter(identifiant)}${pathname}`;
