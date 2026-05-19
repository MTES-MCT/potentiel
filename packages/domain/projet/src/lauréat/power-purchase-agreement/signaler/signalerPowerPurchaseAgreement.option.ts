import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

export type SignalerPowerPurchaseAgreementOptions = {
  signaléLe: DateTime.ValueType;
  signaléPar: Email.ValueType;
  rôleUtilisateur: Role.ValueType;
};
