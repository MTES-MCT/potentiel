import { DateTime, Email } from '@potentiel-domain/common';

export type SupprimerDépôtOptions = {
  suppriméLe: DateTime.ValueType;
  suppriméPar: Email.ValueType;
};
