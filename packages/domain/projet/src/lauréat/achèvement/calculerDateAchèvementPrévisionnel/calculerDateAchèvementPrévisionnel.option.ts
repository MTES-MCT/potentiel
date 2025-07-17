export type CalculerDateAchèvementPrévisionnelOptions =
  | { type: 'notification' }
  | { type: 'ajout-cdc-30/08/2022' }
  | { type: 'délai-accordé'; nombreDeMois: number };
