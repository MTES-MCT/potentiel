type Affichage = {
  label: string;
  url: string;
};

export type ChampsAvecAffichage<T> = {
  value: T | 'Champs non renseigné';
  affichage?: Affichage;
};
