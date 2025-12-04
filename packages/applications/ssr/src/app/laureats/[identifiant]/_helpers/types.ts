type Action = {
  label: string;
  url: string;
};

export type ChampsAvecAction<T> = {
  value?: T;
  action?: Action;
};
