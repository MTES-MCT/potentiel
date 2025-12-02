type Action = {
  label: string;
  url: string;
};

export type ChampsAvecAction<T> = {
  value: T | 'Champs non renseigné';
  action?: Action;
};
