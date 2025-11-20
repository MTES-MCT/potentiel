// wording affichage
type Affichage = {
  label: string;
  url: string;
};

export type ChampsAvecAction<T> = {
  value: T | 'Champs non renseigné';
  affichage?: Affichage;
};
