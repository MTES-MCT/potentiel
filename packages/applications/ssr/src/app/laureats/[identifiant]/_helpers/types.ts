type Action = {
  label: string;
  url: string;
};

export type ChampAvecAction<T> = {
  value?: T;
  action?: Action;
};

export type ChampObligatoireAvecAction<T> = {
  value: T;
  action?: Action;
};

export type ChampAvecMultiplesActions<T> = {
  value: T;
  actions: Array<Action>;
};
