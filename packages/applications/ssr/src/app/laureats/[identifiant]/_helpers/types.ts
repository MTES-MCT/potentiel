type Action = {
  label: string;
  url: string;
};

export type ChampsAvecAction<T> = {
  value: T | undefined;
  action?: Action;
};
