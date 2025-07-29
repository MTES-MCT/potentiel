export type CalculerDateAchèvementPrévisionnelOptions =
  | { type: 'notification' }
  | {
      type: 'ajout-délai-cdc-30_08_2022' | 'retrait-délai-cdc-30_08_2022' | 'délai-accordé';
      nombreDeMois: number;
    };
