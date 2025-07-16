export type CalculerDateAchèvementPrévisionnelOptions =
  | { type: 'notification' }
  | { type: 'délai-accordé'; nombreDeMois: number };
