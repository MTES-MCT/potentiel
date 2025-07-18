export type CalculerDateAchèvementPrévisionnelOptions =
  | { type: 'notification' }
  | { type: 'ajout-délai-cdc-30_08_2022' }
  | { type: 'retrait-délai-cdc-30_08_2022' }
  | { type: 'délai-accordé'; nombreDeMois: number };
