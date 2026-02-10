import { Option } from './option.js';
// Initiallement none était un Symbol, cependant le symbol ne pas être unique côté client et server dans un contexte SSR,
// car l'hydratation côté Front nécessite la sérialization de la variable. Le symbol est donc différent côté client et server.
// Cela pose probléme pour le control flow une fois les données récupérées dans une page. Donc le type valeur de none a été
// fixé à cette valeur pour garantir l'isomorphisme de la libraries et débloquer le control flow partout.
export const none = { type: `__none__` } as const;

export type None = typeof none;

export const isNone = <TType>(value: Option<TType>): value is None => {
  return value instanceof Object && value.type === none.type;
};
